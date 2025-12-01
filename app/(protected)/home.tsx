import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { Search, Filter, Package, Calendar, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/header/AppHeader';
import { ProductWithCategory, Category } from '@/types/product.types';
import { productService } from '@/services/productService';

const { width } = Dimensions.get('window');
const ITEMS_PER_PAGE = 6;

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  
// TODO: Replace with the requirements you require
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'name' | 'price-asc' | 'price-desc'>('latest');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products, sortBy]);


  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getProductsWithCategory(),
        productService.getCategories(),
      ]);

      setProducts(productsData);
      setCategories([
        { id: 'all', name: 'All Products', slug: 'all', description: '', icon: '📦', color: '#6366f1' },
        ...categoriesData
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch products. Please try again.');
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.categoryId === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return +new Date(b.createdAt) - +new Date(a.createdAt);
        case 'oldest':
          return +new Date(a.createdAt) - +new Date(b.createdAt);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStockStatus = (product: ProductWithCategory) => {
    if (product.stockSystem <= 0) return { text: 'Out of Stock', color: '#ef4444' };
    if (product.stockSystem <= product.minStock) return { text: 'Low Stock', color: '#f59e0b' };
    return { text: 'In Stock', color: '#10b981' };
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleProfilePress = () => {
    router.push('/(protected)/settings');
  };

  const handleProductPress = (product: ProductWithCategory) => {
    console.log('Product pressed:', product.id);
    // Navigate to product detail page
    // router.push(`/(protected)/products/${product.id}`);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading products...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Search */}
      <AppHeader
        variant="search"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search products..."
        user={{ ...user }}
        onProfilePress={handleProfilePress}
        colors={colors}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === category.id
                    ? colors.primary
                    : `${colors.primary}10`,
                },
              ]}
              onPress={() => setSelectedCategory(category.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryIcon}></Text>
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === category.id ? '#FFFFFF' : colors.text,
                    fontWeight: selectedCategory === category.id ? '700' : '500',
                  },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sort Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.sortScroll}
          contentContainerStyle={styles.sortContainer}
        >
          {[
            { value: 'latest', label: 'Latest' },
            { value: 'oldest', label: 'Oldest' },
            { value: 'name', label: 'Name' },
            { value: 'price-asc', label: 'Price: Low to High' },
            { value: 'price-desc', label: 'Price: High to Low' },
          ].map((sort) => (
            <TouchableOpacity
              key={sort.value}
              style={[
                styles.sortChip,
                {
                  backgroundColor: sortBy === sort.value
                    ? colors.primary
                    : `${colors.primary}05`,
                  borderColor: sortBy === sort.value ? colors.primary : `${colors.primary}20`,
                },
              ]}
              onPress={() => setSortBy(sort.value as any)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.sortText,
                  {
                    color: sortBy === sort.value ? '#FFFFFF' : colors.text,
                    fontWeight: sortBy === sort.value ? '600' : '500',
                  },
                ]}
              >
                {sort.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Count */}
        <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
          Showing {currentProducts.length} of {filteredProducts.length} products
        </Text>

        {/* Products List */}
        {currentProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Package size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No products found
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Try adjusting your search or filter
            </Text>
          </View>
        ) : (
          <View style={styles.productsList}>
            {currentProducts.map((product) => {
              const stockStatus = getStockStatus(product);
              return (
                <TouchableOpacity
                  key={product.id}
                  style={[styles.card, {
                    backgroundColor: colors.card || colors.background,
                    shadowColor: colors.text,
                  }]}
                  onPress={() => handleProductPress(product)}
                  activeOpacity={0.9}
                >
                  {/* Product Header */}
                  <View style={styles.cardHeader}>
                    <View style={[styles.categoryBadge, { backgroundColor: `${product.category?.color || colors.primary}20` }]}>
                      <Text style={styles.categoryBadgeIcon}></Text>
                      <Text style={[styles.categoryBadgeText, { color: product.category?.color || colors.primary }]}>
                        {product.category?.name || 'Uncategorized'}
                      </Text>
                    </View>
                    <View style={[styles.stockBadge, { backgroundColor: `${stockStatus.color}15` }]}>
                      <View style={[styles.stockDot, { backgroundColor: stockStatus.color }]} />
                      <Text style={[styles.stockText, { color: stockStatus.color }]}>
                        {stockStatus.text}
                      </Text>
                    </View>
                  </View>

                  {/* Product Info */}
                  <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
                      {product.name}
                    </Text>
                    {product.description && (
                      <Text style={[styles.cardDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                        {product.description}
                      </Text>
                    )}

                    {/* Stock Info */}
                    <View style={styles.stockInfo}>
                      <View style={styles.stockItem}>
                        <Text style={[styles.stockLabel, { color: colors.textSecondary }]}>Stock</Text>
                        <Text style={[styles.stockValue, { color: colors.text }]}>
                          {product.stockSystem} {product.unit}
                        </Text>
                      </View>
                      <View style={styles.stockItem}>
                        <Text style={[styles.stockLabel, { color: colors.textSecondary }]}>Min. Stock</Text>
                        <Text style={[styles.stockValue, { color: colors.text }]}>
                          {product.minStock} {product.unit}
                        </Text>
                      </View>
                    </View>

                    {/* Price & Date */}
                    <View style={styles.cardFooter}>
                      <Text style={[styles.priceText, { color: colors.primary }]}>
                        {formatPrice(product.price)}
                      </Text>
                      <View style={styles.dateContainer}>
                        <Calendar size={12} color={colors.textSecondary} />
                        <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                          {formatDate(product.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Low Stock Warning */}
                  {product.stockSystem <= product.minStock && product.stockSystem > 0 && (
                    <View style={[styles.warningBanner, { backgroundColor: '#f59e0b15' }]}>
                      <AlertCircle size={14} color="#f59e0b" />
                      <Text style={[styles.warningText, { color: '#f59e0b' }]}>
                        Stock is running low!
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                {
                  backgroundColor: currentPage === 1 ? `${colors.primary}10` : colors.primary,
                },
              ]}
              onPress={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              activeOpacity={0.7}
            >
              <ChevronLeft size={20} color={currentPage === 1 ? colors.textSecondary : '#FFFFFF'} />
            </TouchableOpacity>

            <View style={styles.pageNumbers}>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <TouchableOpacity
                    key={pageNum}
                    style={[
                      styles.pageNumber,
                      {
                        backgroundColor: currentPage === pageNum ? colors.primary : `${colors.primary}10`,
                      },
                    ]}
                    onPress={() => goToPage(pageNum)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.pageNumberText,
                        {
                          color: currentPage === pageNum ? '#FFFFFF' : colors.text,
                          fontWeight: currentPage === pageNum ? '700' : '500',
                        },
                      ]}
                    >
                      {pageNum}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                styles.paginationButton,
                {
                  backgroundColor: currentPage === totalPages ? `${colors.primary}10` : colors.primary,
                },
              ]}
              onPress={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              activeOpacity={0.7}
            >
              <ChevronRight
                size={20}
                color={currentPage === totalPages ? colors.textSecondary : '#FFFFFF'}
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  categoryScroll: {
    marginBottom: 12,
  },
  categoryContainer: {
    paddingHorizontal: 24,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 14,
  },
  sortScroll: {
    marginBottom: 16,
  },
  sortContainer: {
    paddingHorizontal: 24,
    gap: 8,
  },
  sortChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  sortText: {
    fontSize: 12,
  },
  resultsText: {
    paddingHorizontal: 24,
    marginBottom: 16,
    fontSize: 13,
  },
  productsList: {
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  categoryBadgeIcon: {
    fontSize: 12,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardContent: {
    padding: 16,
    paddingTop: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 24,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  stockInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  stockItem: {
    flex: 1,
  },
  stockLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  stockValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '500',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  warningText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
  },
  paginationButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageNumbers: {
    flexDirection: 'row',
    gap: 8,
  },
  pageNumber: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageNumberText: {
    fontSize: 14,
  },
});