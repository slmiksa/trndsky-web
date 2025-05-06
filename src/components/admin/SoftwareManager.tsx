
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SoftwareProductDialog } from './SoftwareProductDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type SoftwareProduct = {
  id: number;
  title: string;
  description: string;
  price: number | null;
  show_price: boolean;
  image_url: string;
};

const SoftwareManager = () => {
  const [products, setProducts] = useState<SoftwareProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<SoftwareProduct | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('software_products')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      console.log("Fetched products:", data);
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('حدث خطأ أثناء تحميل البرمجيات');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: SoftwareProduct) => {
    console.log("Editing product:", product);
    setCurrentProduct({...product}); // Make a copy to avoid reference issues
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      const { error } = await supabase
        .from('software_products')
        .delete()
        .eq('id', productToDelete);
      
      if (error) throw error;
      
      setProducts(products.filter(product => product.id !== productToDelete));
      toast.success('تم حذف البرنامج بنجاح');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('حدث خطأ أثناء حذف البرنامج');
    } finally {
      setProductToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleOpenDeleteDialog = (id: number) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleAddNew = () => {
    setCurrentProduct(null);
    setDialogOpen(true);
  };

  const handleDialogClose = (refreshData?: boolean) => {
    setDialogOpen(false);
    if (refreshData) {
      fetchProducts();
    }
  };

  const formatPrice = (product: SoftwareProduct) => {
    if (!product.show_price) {
      return null;
    }
    
    return product.price !== null ? 
      `${product.price.toLocaleString()} ر.س` : 
      null;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Button onClick={handleAddNew} className="font-tajawal">
          <Plus className="w-4 h-4 mr-2" />
          إضافة برنامج جديد
        </Button>
        <h2 className="text-2xl font-bold font-tajawal">إدارة البرمجيات</h2>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="w-12 h-12 border-4 border-trndsky-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-trndsky-blue">جاري التحميل...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl shadow-sm">
          <p className="text-xl text-gray-500 mb-4 font-tajawal">لا توجد برمجيات متاحة حالياً</p>
          <Button onClick={handleAddNew} className="font-tajawal">إضافة برنامج جديد</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image_url} 
                  alt={product.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-right font-tajawal">{product.title}</CardTitle>
                {formatPrice(product) && (
                  <CardDescription className="text-right font-tajawal flex items-center justify-end">
                    {product.show_price && <Eye className="w-4 h-4 ml-1" />}
                    {formatPrice(product)}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="text-right">
                <p className="text-sm text-gray-600 line-clamp-3 font-tajawal">{product.description}</p>
              </CardContent>
              <div className="p-4 pt-0 flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenDeleteDialog(product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(product)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <SoftwareProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={currentProduct}
        onSuccess={() => fetchProducts()}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="font-tajawal">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من رغبتك في حذف هذا البرنامج؟ هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse">
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">حذف</AlertDialogAction>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SoftwareManager;
