"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

interface Payment {
  id: number;
  amount: number;
  date: string;
  status: string;
  students: { id: number; name: string; email: string };
  courses: { id: number; title: string };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://31.97.49.20/api/payments");
      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        setPayments(result.data);
      } else {
        setPayments([]);
        console.error("Unexpected response format:", result);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    setUpdating(id);
    try {
      await fetch(`http://31.97.49.20/api/payments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchPayments();
    } catch (error) {
      console.error("Error updating payment:", error);
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="p-6">
      <Card className="shadow-lg dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-500" />
            Payments Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
            </div>
          ) : (
            <Table className="text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.students.name}</TableCell>
                    <TableCell>{payment.courses.title}</TableCell>
                    <TableCell>${payment.amount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={payment.status}
                        onValueChange={(value) => updateStatus(payment.id, value)}
                        disabled={updating === payment.id}
                      >
                        <SelectTrigger className="w-[120px] text-sm">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 px-3 py-1 text-sm"
                        onClick={() => fetchPayments()}
                        disabled={updating === payment.id}
                      >
                        {updating === payment.id ? (
                          <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                          "Refresh"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
