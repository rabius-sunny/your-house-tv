'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useAsync } from '@/hooks/useAsync';
import request from '@/services/http';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import UserCreateForm from './UserCreateForm';
import UserEditForm from './UserEditForm';

type User = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export default function UserList() {
  const { data: users, loading, refetch } = useAsync('/users');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditDialogOpen(true);
  };

  const handleUserUpdated = () => {
    setEditDialogOpen(false);
    setEditingUser(null);
    refetch();
  };

  const handleUserCreated = () => {
    setCreateDialogOpen(false);
    refetch();
  };

  const handleDelete = async (userId: string) => {
    // Prevent deletion if there's only one user
    if (users && users.length <= 1) {
      toast.error('Cannot delete user', {
        description: 'At least one user must remain in the system'
      });
      return;
    }

    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      setDeletingId(userId);
      await request.delete(`/users?id=${userId}`);
      toast.success('User deleted successfully!');
      refetch();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      let errorMessage = 'Failed to delete user';
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      toast.error('Failed to delete user', {
        description: errorMessage
      });
    } finally {
      setDeletingId(null);
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

  // Loading Skeleton Component
  const UserListSkeleton = () => (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className='flex items-center space-x-4'
            >
              <Skeleton className='h-4 w-64' />
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-8 w-16' />
              <Skeleton className='h-8 w-16' />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <UserListSkeleton />;
  }

  if (!users || users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <div className='w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center'>
              <svg
                className='w-8 h-8 text-muted-foreground'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold mb-2'>No users found</h3>
            <p className='text-muted-foreground'>
              No users have been registered yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Users ({users.length})</CardTitle>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className='flex items-center gap-2'
            >
              <Plus className='h-4 w-4' />
              Create User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell className='font-medium'>{user.email}</TableCell>
                    <TableCell className='text-muted-foreground'>
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {formatDate(user.updatedAt)}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleEdit(user)}
                          className='flex items-center justify-center w-9 h-9 p-0'
                          title='Edit user'
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='destructive'
                          size='sm'
                          onClick={() => handleDelete(user.id)}
                          disabled={
                            deletingId === user.id ||
                            (users && users.length <= 1)
                          }
                          className='flex items-center justify-center w-9 h-9 p-0'
                          title={
                            users && users.length <= 1
                              ? 'Cannot delete the last user'
                              : 'Delete user'
                          }
                        >
                          {deletingId === user.id ? (
                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                          ) : (
                            <Trash2 className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <UserEditForm
        user={editingUser}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUserSaved={handleUserUpdated}
      />

      {/* Create User Dialog */}
      <UserCreateForm
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onUserCreated={handleUserCreated}
      />
    </>
  );
}
