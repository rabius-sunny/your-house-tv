'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import request from '@/services/http';
import { Contact } from '@/types';
import { Eye, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type ContactsResponse = {
  contacts: Contact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export default function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const response = await request.get<ContactsResponse>('/contact');
      setContacts(response.data.contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to fetch contacts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleView = (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact message?')) {
      return;
    }

    try {
      setIsDeleting(contactId);
      await request.delete(`/contact?id=${contactId}`);
      setContacts(contacts.filter((contact) => contact.id !== contactId));
      toast.success('Contact message deleted successfully');
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact message');
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='space-y-4'>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className='flex justify-between items-center'
              >
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-48' />
                  <Skeleton className='h-3 w-32' />
                </div>
                <div className='flex gap-2'>
                  <Skeleton className='h-8 w-8' />
                  <Skeleton className='h-8 w-8' />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (contacts.length === 0) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='text-center py-8'>
            <p className='text-muted-foreground'>No contact messages found.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Message Preview</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className='w-24'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className='font-medium'>{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone || 'N/A'}</TableCell>
                  <TableCell className='max-w-xs truncate'>
                    {contact.message}
                  </TableCell>
                  <TableCell>
                    {formatDate(contact.createdAt.toString())}
                  </TableCell>
                  <TableCell>
                    <div className='flex gap-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleView(contact)}
                        title='View details'
                        className='bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors'
                      >
                        <Eye className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleDelete(contact.id)}
                        disabled={isDeleting === contact.id}
                        title='Delete contact'
                        className='bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Contact Dialog */}
      <Dialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      >
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Contact Message Details</DialogTitle>
          </DialogHeader>

          {selectedContact && (
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Name
                  </label>
                  <p className='mt-1'>{selectedContact.name}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Email
                  </label>
                  <p className='mt-1'>{selectedContact.email}</p>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Phone
                  </label>
                  <p className='mt-1'>
                    {selectedContact.phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    Date
                  </label>
                  <p className='mt-1'>
                    {formatDate(selectedContact.createdAt.toString())}
                  </p>
                </div>
              </div>

              <div>
                <label className='text-sm font-medium text-muted-foreground'>
                  Message
                </label>
                <div className='mt-1 p-3 bg-muted/50 rounded-md'>
                  <p className='whitespace-pre-wrap'>
                    {selectedContact.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
