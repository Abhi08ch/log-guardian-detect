
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface DataUploaderProps {
  onDataUploaded: (data: any, type: 'train' | 'test') => void;
}

const DataUploader: React.FC<DataUploaderProps> = ({ onDataUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'train' | 'test') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // In a real app, we would send this to a backend
    // For now, we'll simulate processing CSV data
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvData = e.target?.result as string;
        // Simple CSV parsing (in a real app, use a proper CSV parser)
        const rows = csvData.split('\n');
        const headers = rows[0].split(',');
        const data = rows.slice(1).map(row => {
          const values = row.split(',');
          return headers.reduce((obj, header, i) => {
            obj[header.trim()] = values[i]?.trim();
            return obj;
          }, {} as Record<string, string>);
        });
        
        onDataUploaded(data, type);
        
        toast({
          title: "Data uploaded successfully",
          description: `${data.length} rows loaded from ${file.name}`,
        });
      } catch (error) {
        toast({
          title: "Error processing file",
          description: "Please ensure the file is a valid CSV",
          variant: "destructive"
        });
        console.error("Error processing CSV:", error);
      }
      
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "Failed to read the uploaded file",
        variant: "destructive"
      });
      setIsUploading(false);
    };
    
    reader.readAsText(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Data Management</CardTitle>
        <CardDescription>Upload your training and test datasets</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="train" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="train">Training Data</TabsTrigger>
            <TabsTrigger value="test">Test Data</TabsTrigger>
          </TabsList>
          <TabsContent value="train" className="mt-4">
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                Upload your training dataset (CSV)
              </p>
              <Input 
                type="file" 
                accept=".csv" 
                className="max-w-sm" 
                onChange={(e) => handleFileUpload(e, 'train')}
                disabled={isUploading}
              />
            </div>
          </TabsContent>
          <TabsContent value="test" className="mt-4">
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                Upload your test dataset (CSV)
              </p>
              <Input 
                type="file" 
                accept=".csv" 
                className="max-w-sm" 
                onChange={(e) => handleFileUpload(e, 'test')}
                disabled={isUploading}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <p>Supported format: CSV</p>
        <p>{isUploading ? 'Processing...' : 'Ready'}</p>
      </CardFooter>
    </Card>
  );
};

export default DataUploader;
