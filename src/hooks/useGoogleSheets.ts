import { useState, useEffect, useCallback } from 'react';
import { fetchGoogleSheetsData, Student } from '../services/googleSheetsService';
import { useToast } from './use-toast';

interface UseGoogleSheetsReturn {
  students: Student[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  isConfigured: boolean;
}

export const useGoogleSheets = (classType: 'plus-one' | 'plus-two'): UseGoogleSheetsReturn => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if Google Sheets is configured
  const isConfigured = !!(import.meta.env.VITE_GOOGLE_SHEETS_API_KEY && import.meta.env.VITE_GOOGLE_SHEET_ID);

  const fetchData = useCallback(async () => {
    if (!isConfigured) {
      setError('Sheets is not configured. Please check your environment variables.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchGoogleSheetsData(classType);
      setStudents(data);
      
      toast({
        title: "Data loaded successfully",
        description: `Loaded ${data.length} students`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      
      toast({
        title: "Error loading data",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [classType, isConfigured, toast]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    students,
    loading,
    error,
    refresh,
    isConfigured,
  };
};
