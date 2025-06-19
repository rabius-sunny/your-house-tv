'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import request from '@/services/http';
import { VlogCategory } from '@/types';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import CategoryDetailsDialog from './CategoryDetailsDialog';

type TProps = {
  categories: VlogCategory[];
  loading: boolean;
  onCategoryDeleted: () => void;
};

export default function CategoryList({
  categories,
  loading,
  onCategoryDeleted
}: TProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<VlogCategory | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewDetails = (category: VlogCategory) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      setDeletingId(categoryId);
      await request.delete(`/category?id=${categoryId}`);
      toast.success('Category deleted successfully!');
      onCategoryDeleted();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading Skeleton Component
  const CategoryTableSkeleton = () => (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-6 w-48' />
          <Skeleton className='h-5 w-32' />
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-muted/50'>
              <tr>
                <th className='p-4 text-left'>
                  <Skeleton className='h-4 w-12' />
                </th>
                <th className='p-4 text-left'>
                  <Skeleton className='h-4 w-16' />
                </th>
                <th className='p-4 text-left'>
                  <Skeleton className='h-4 w-20' />
                </th>
                <th className='p-4 text-left'>
                  <Skeleton className='h-4 w-16' />
                </th>
                <th className='p-4 text-left'>
                  <Skeleton className='h-4 w-16' />
                </th>
                <th className='p-4 text-left'>
                  <Skeleton className='h-4 w-16' />
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr
                  key={index}
                  className='border-b border-border/40'
                >
                  <td className='p-4'>
                    <Skeleton className='h-4 w-8' />
                  </td>
                  <td className='p-4'>
                    <Skeleton className='h-4 w-32' />
                  </td>
                  <td className='p-4'>
                    <Skeleton className='h-4 w-40' />
                  </td>
                  <td className='p-4'>
                    <Skeleton className='h-5 w-16' />
                  </td>
                  <td className='p-4'>
                    <Skeleton className='h-4 w-24' />
                  </td>
                  <td className='p-4'>
                    <div className='flex gap-2'>
                      <Skeleton className='h-8 w-8' />
                      <Skeleton className='h-8 w-8' />
                      <Skeleton className='h-8 w-8' />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  // Show loading skeleton while loading
  if (loading) {
    return <CategoryTableSkeleton />;
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className='flex flex-col items-center justify-center py-16'>
          <div className='text-center max-w-md'>
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
                  d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold mb-2'>No categories found</h3>
            <p className='text-muted-foreground'>
              Create your first category to organize your vlogs and podcasts.
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
            <CardTitle className='text-xl font-bold'>Categories</CardTitle>
            <p className='text-sm text-muted-foreground'>
              {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
            </p>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-muted/50 border-b border-border/40'>
                <tr>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground'>
                    #
                  </th>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground'>
                    Name
                  </th>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground'>
                    Description
                  </th>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground'>
                    Status
                  </th>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground'>
                    Created
                  </th>
                  <th className='p-4 text-left text-sm font-semibold text-muted-foreground'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border/40'>
                {categories.map((category, index) => (
                  <tr
                    key={category.id}
                    className='hover:bg-muted/30 transition-colors duration-200 group'
                  >
                    <td className='p-4'>
                      <span className='text-sm text-muted-foreground font-mono'>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </td>
                    <td className='p-4'>
                      <div className='flex items-center gap-2'>
                        <span className='font-medium text-foreground'>
                          {category.name}
                        </span>
                        {category.isFeatured && (
                          <Badge
                            variant='secondary'
                            className='text-xs animate-pulse'
                          >
                            Featured
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className='p-4'>
                      <span className='text-sm text-muted-foreground max-w-xs truncate block'>
                        {category.description || 'No description'}
                      </span>
                    </td>
                    <td className='p-4'>
                      <Badge
                        variant={category.isFeatured ? 'default' : 'outline'}
                        className='text-xs'
                      >
                        {category.isFeatured ? 'Featured' : 'Regular'}
                      </Badge>
                    </td>
                    <td className='p-4'>
                      <span className='text-sm text-muted-foreground'>
                        {formatDate(category.createdAt)}
                      </span>
                    </td>
                    <td className='p-4'>
                      <div className='flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-200'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary'
                          title='View details'
                          onClick={() => handleViewDetails(category)}
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-600'
                          title='Edit category'
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleDelete(category.id)}
                          disabled={deletingId === category.id}
                          className='h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50'
                          title='Delete category'
                        >
                          {deletingId === category.id ? (
                            <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                          ) : (
                            <Trash2 className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Category Details Dialog */}
      <CategoryDetailsDialog
        category={selectedCategory}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
