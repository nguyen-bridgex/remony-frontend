import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { 
  Hospital, 
  getHospitalList, 
  createHospital, 
  editHospital, 
  deleteHospital,
  CreateHospitalRequest,
  EditHospitalRequest 
} from '../api/hospitals';

interface HospitalFormData {
  name: string;
  address: string;
  service_account: string;
  client_id: string;
  client_secret: string;
  bot_no: string;
  token_url: string;
  api_base_url: string;
  private_key: string;
}

const HospitalManagementPage = () => {
  const router = useRouter();
  
  // State
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Hospital>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingHospitalId, setDeletingHospitalId] = useState<number | null>(null);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  
  // Form data
  const [formData, setFormData] = useState<HospitalFormData>({
    name: '',
    address: '',
    service_account: '',
    client_id: '',
    client_secret: '',
    bot_no: '',
    token_url: '',
    api_base_url: '',
    private_key: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Search and sort functionality
  const filterAndSortHospitals = (hospitals: Hospital[], searchTerm: string, sortField: keyof Hospital, sortDirection: 'asc' | 'desc') => {
    // First filter
    let filtered = hospitals;
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = hospitals.filter(hospital => {
        return (
          hospital.name.toLowerCase().includes(lowerSearchTerm) ||
          (hospital.address && hospital.address.toLowerCase().includes(lowerSearchTerm)) ||
          (hospital.service_account && hospital.service_account.toLowerCase().includes(lowerSearchTerm)) ||
          (hospital.client_id && hospital.client_id.toLowerCase().includes(lowerSearchTerm)) ||
          (hospital.client_secret && hospital.client_secret.toLowerCase().includes(lowerSearchTerm)) ||
          (hospital.bot_no && hospital.bot_no.toLowerCase().includes(lowerSearchTerm)) ||
          (hospital.token_url && hospital.token_url.toLowerCase().includes(lowerSearchTerm)) ||
          (hospital.api_base_url && hospital.api_base_url.toLowerCase().includes(lowerSearchTerm)) ||
          (hospital.private_key && hospital.private_key.toLowerCase().includes(lowerSearchTerm)) ||
          hospital.id.toString().includes(lowerSearchTerm)
        );
      });
    }

    // Then sort
    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      // Handle null values
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return sortDirection === 'asc' ? 1 : -1;
      if (bValue === null) return sortDirection === 'asc' ? -1 : 1;
      
      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      // Handle number comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  };

  // Update filtered hospitals when search term, sort field, sort direction, or hospitals change
  useEffect(() => {
    setFilteredHospitals(filterAndSortHospitals(hospitals, searchTerm, sortField, sortDirection));
  }, [hospitals, searchTerm, sortField, sortDirection]);

  // Fetch hospitals
  const fetchHospitals = async () => {
    setIsLoading(true);
    try {
      const response = await getHospitalList();
      if (response.success && response.hospitals) {
        setHospitals(response.hospitals);
      } else {
        toast.error('事業所リストの取得に失敗しました');
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
              toast.error('事業所リストの取得中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  // Navigation
  const handleGoHome = () => {
    router.push('/');
  };

  // Search and sort handling
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleSort = (field: keyof Hospital) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof Hospital) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  // Form handling
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '事業所名は必須です';
    } else if (formData.name.length < 2) {
      newErrors.name = '事業所名は2文字以上で入力してください';
    } else if (formData.name.length > 100) {
      newErrors.name = '事業所名は100文字以内で入力してください';
    }

    if (formData.address.length > 200) {
      newErrors.address = '住所は200文字以内で入力してください';
    }

    if (formData.service_account.length > 100) {
      newErrors.service_account = 'サービスアカウントは100文字以内で入力してください';
    }

    if (formData.client_id.length > 100) {
      newErrors.client_id = 'クライアントIDは100文字以内で入力してください';
    }

    if (formData.client_secret.length > 100) {
      newErrors.client_secret = 'クライアントシークレットは100文字以内で入力してください';
    }

    if (formData.bot_no.length > 50) {
      newErrors.bot_no = 'ボット番号は50文字以内で入力してください';
    }

    if (formData.token_url.length > 500) {
      newErrors.token_url = 'トークンURLは500文字以内で入力してください';
    }

    if (formData.api_base_url.length > 500) {
      newErrors.api_base_url = 'API Base URLは500文字以内で入力してください';
    }

    if (formData.private_key.length > 2000) {
      newErrors.private_key = 'プライベートキーは2000文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Modal handlers
  const openCreateModal = () => {
    setFormData({ 
      name: '', 
      address: '',
      service_account: '',
      client_id: '',
      client_secret: '',
      bot_no: '',
      token_url: '',
      api_base_url: '',
      private_key: ''
    });
    setErrors({});
    setIsCreateModalOpen(true);
  };

  const openEditModal = (hospital: Hospital) => {
    setEditingHospital(hospital);
    setFormData({
      name: hospital.name,
      address: hospital.address || '',
      service_account: hospital.service_account || '',
      client_id: hospital.client_id || '',
      client_secret: hospital.client_secret || '',
      bot_no: hospital.bot_no || '',
      token_url: hospital.token_url || '',
      api_base_url: hospital.api_base_url || '',
      private_key: hospital.private_key || ''
    });
    setErrors({});
    setIsEditModalOpen(true);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setEditingHospital(null);
    setFormData({ 
      name: '', 
      address: '',
      service_account: '',
      client_id: '',
      client_secret: '',
      bot_no: '',
      token_url: '',
      api_base_url: '',
      private_key: ''
    });
    setErrors({});
  };

  // CRUD operations
  const handleCreateHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData: CreateHospitalRequest = {
        name: formData.name.trim(),
        address: formData.address.trim() || undefined,
        service_account: formData.service_account.trim() || undefined,
        client_id: formData.client_id.trim() || undefined,
        client_secret: formData.client_secret.trim() || undefined,
        bot_no: formData.bot_no.trim() || undefined,
        token_url: formData.token_url.trim() || undefined,
        api_base_url: formData.api_base_url.trim() || undefined,
        private_key: formData.private_key.trim() || undefined
      };

      const result = await createHospital(requestData);
      
      if (result.success) {
        toast.success('事業所を登録しました');
        closeModals();
        fetchHospitals(); // Refresh list
      } else {
        toast.error(`登録に失敗しました: ${result.message}`);
      }
    } catch (error) {
      console.error('Error creating hospital:', error);
              toast.error('事業所の登録中にエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !editingHospital) {
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData: EditHospitalRequest = {
        id: editingHospital.id,
        name: formData.name.trim(),
        address: formData.address.trim() || undefined,
        service_account: formData.service_account.trim() || undefined,
        client_id: formData.client_id.trim() || undefined,
        client_secret: formData.client_secret.trim() || undefined,
        bot_no: formData.bot_no.trim() || undefined,
        token_url: formData.token_url.trim() || undefined,
        api_base_url: formData.api_base_url.trim() || undefined,
        private_key: formData.private_key.trim() || undefined
      };

      const result = await editHospital(requestData);
      
      if (result.success) {
        toast.success('事業所情報を更新しました');
        closeModals();
        fetchHospitals(); // Refresh list
      } else {
        toast.error(`更新に失敗しました: ${result.message}`);
      }
    } catch (error) {
      console.error('Error editing hospital:', error);
              toast.error('事業所情報の更新中にエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteHospital = async (hospital: Hospital) => {
    if (!confirm(`${hospital.name}を削除しますか？この操作は取り消せません。`)) {
      return;
    }

    setDeletingHospitalId(hospital.id);
    try {
      const result = await deleteHospital({ id: hospital.id });
      
      if (result.success) {
        toast.success(`${hospital.name}を削除しました`);
        fetchHospitals(); // Refresh list
      } else {
        toast.error(`削除に失敗しました: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting hospital:', error);
              toast.error('事業所の削除中にエラーが発生しました');
    } finally {
      setDeletingHospitalId(null);
    }
  };

  // Render modal
  const renderModal = (isOpen: boolean, title: string, onSubmit: (e: React.FormEvent) => void) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
          
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Hospital Name */}
            <div>
                             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                 事業所名 <span className="text-red-500">*</span>
               </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-all ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                                 placeholder="事業所名を入力してください"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                住所
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-all ${
                  errors.address 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="住所を入力してください（任意）"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* Service Account */}
            <div>
              <label htmlFor="service_account" className="block text-sm font-medium text-gray-700 mb-1">
                サービスアカウント
              </label>
              <input
                type="text"
                id="service_account"
                name="service_account"
                value={formData.service_account}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-all ${
                  errors.service_account 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="サービスアカウントを入力してください（任意）"
              />
              {errors.service_account && <p className="text-red-500 text-sm mt-1">{errors.service_account}</p>}
            </div>

            {/* Client ID */}
            <div>
              <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 mb-1">
                クライアントID
              </label>
              <input
                type="text"
                id="client_id"
                name="client_id"
                value={formData.client_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-all ${
                  errors.client_id 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="クライアントIDを入力してください（任意）"
              />
              {errors.client_id && <p className="text-red-500 text-sm mt-1">{errors.client_id}</p>}
            </div>

            {/* Client Secret */}
            <div>
              <label htmlFor="client_secret" className="block text-sm font-medium text-gray-700 mb-1">
                クライアントシークレット
              </label>
              <input
                type="text"
                id="client_secret"
                name="client_secret"
                value={formData.client_secret}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-all ${
                  errors.client_secret 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="クライアントシークレットを入力してください（任意）"
              />
              {errors.client_secret && <p className="text-red-500 text-sm mt-1">{errors.client_secret}</p>}
            </div>

            {/* Bot No */}
            <div>
              <label htmlFor="bot_no" className="block text-sm font-medium text-gray-700 mb-1">
                ボット番号
              </label>
              <input
                type="text"
                id="bot_no"
                name="bot_no"
                value={formData.bot_no}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-all ${
                  errors.bot_no 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="ボット番号を入力してください（任意）"
              />
              {errors.bot_no && <p className="text-red-500 text-sm mt-1">{errors.bot_no}</p>}
            </div>

            {/* Token URL */}
            <div>
              <label htmlFor="token_url" className="block text-sm font-medium text-gray-700 mb-1">
                トークンURL
              </label>
              <input
                type="text"
                id="token_url"
                name="token_url"
                value={formData.token_url}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-all ${
                  errors.token_url 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="トークンURLを入力してください（任意）"
              />
              {errors.token_url && <p className="text-red-500 text-sm mt-1">{errors.token_url}</p>}
            </div>

            {/* API Base URL */}
            <div>
              <label htmlFor="api_base_url" className="block text-sm font-medium text-gray-700 mb-1">
                API Base URL
              </label>
              <input
                type="text"
                id="api_base_url"
                name="api_base_url"
                value={formData.api_base_url}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-all ${
                  errors.api_base_url 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="API Base URLを入力してください（任意）"
              />
              {errors.api_base_url && <p className="text-red-500 text-sm mt-1">{errors.api_base_url}</p>}
            </div>

            {/* Private Key */}
            <div>
              <label htmlFor="private_key" className="block text-sm font-medium text-gray-700 mb-1">
                プライベートキー
              </label>
              <textarea
                id="private_key"
                name="private_key"
                value={formData.private_key}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-all ${
                  errors.private_key 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="プライベートキーを入力してください（任意）"
              />
              {errors.private_key && <p className="text-red-500 text-sm mt-1">{errors.private_key}</p>}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={closeModals}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? '処理中...' : (title.includes('登録') ? '登録' : '更新')}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">事業所リストを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                                 <h1 className="text-3xl font-bold text-white">事業所管理</h1>
                 <p className="text-green-100 mt-2">事業所の登録・編集・削除</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleGoHome}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-400 transition-colors shadow-lg border-2 border-green-400"
                >
                  ホームに戻る
                </button>
                <button
                  onClick={openCreateModal}
                  className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
                >
                                     新しい事業所を登録
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="事業所名、住所、ID、その他の情報で検索..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent focus:ring-blue-500 transition-all text-gray-700 placeholder-gray-500"
                />
              </div>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="px-4 py-3 text-gray-500 hover:text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title="検索をクリア"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="mt-2 text-sm text-gray-600">
                検索結果: <span className="font-semibold text-blue-600">{filteredHospitals.length}</span> 件
              </div>
            )}
          </div>



          {/* Hospital List */}
          <div className="p-6">
            {filteredHospitals.length === 0 ? (
              <div className="text-center py-12">
                {searchTerm ? (
                  <>
                    <div className="text-gray-500 text-lg font-semibold mb-2">検索結果が見つかりません</div>
                    <p className="text-gray-400 text-sm mb-4">「{searchTerm}」に一致する事業所が見つかりませんでした</p>
                    <button
                      onClick={clearSearch}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
                    >
                      検索をクリア
                    </button>
                    <button
                      onClick={openCreateModal}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      新しい事業所を登録
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-gray-500 text-lg font-semibold mb-2">登録されている事業所がありません</div>
                    <p className="text-gray-400 text-sm mb-4">上のボタンから新しい事業所を登録してください</p>
                    <button
                      onClick={openCreateModal}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      事業所を登録
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      事業所一覧 ({filteredHospitals.length}件)
                    </h2>
                    {searchTerm && (
                      <div className="text-sm text-gray-600">
                        検索: <span className="font-semibold text-blue-600">&quot;{searchTerm}&quot;</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Sort Controls */}
                  <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-semibold text-gray-700">並び替え:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSort('name')}
                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          sortField === 'name' 
                            ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        名前 {getSortIcon('name')}
                      </button>
                      <button
                        onClick={() => handleSort('id')}
                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          sortField === 'id' 
                            ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        ID {getSortIcon('id')}
                      </button>
                      <button
                        onClick={() => handleSort('address')}
                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          sortField === 'address' 
                            ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        住所 {getSortIcon('address')}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredHospitals.map(hospital => (
                    <div key={hospital.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-200">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-lg font-bold text-gray-900 mb-0.5">{hospital.name}</h3>
                            <p className="text-xs text-gray-500 font-medium">ID: {hospital.id}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-3 mb-4">
                        <div className="bg-gray-50 rounded-md p-3">
                          <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">基本情報</h4>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-0.5">住所</p>
                              <p className="text-xs text-gray-600 italic">{hospital.address || '未設定'}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-0.5">サービスアカウント</p>
                              <p className="text-xs text-gray-600 italic">{hospital.service_account || '未設定'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded-md p-3">
                          <h4 className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">認証情報</h4>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-semibold text-blue-700 mb-0.5">クライアントID</p>
                              <p className="text-xs text-blue-600 italic">{hospital.client_id || '未設定'}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-blue-700 mb-0.5">クライアントシークレット</p>
                              <p className="text-xs text-blue-600 italic">{hospital.client_secret ? '***設定済み***' : '未設定'}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-blue-700 mb-0.5">プライベートキー</p>
                              <p className="text-xs text-blue-600 italic">{hospital.private_key ? '***設定済み***' : '未設定'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 rounded-md p-3">
                          <h4 className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide">API設定</h4>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-semibold text-green-700 mb-0.5">ボット番号</p>
                              <p className="text-xs text-green-600 italic">{hospital.bot_no || '未設定'}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-green-700 mb-0.5">トークンURL</p>
                              <p className="text-xs text-green-600 italic break-all">{hospital.token_url || '未設定'}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-green-700 mb-0.5">API Base URL</p>
                              <p className="text-xs text-green-600 italic break-all">{hospital.api_base_url || '未設定'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(hospital)}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 transition-colors"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDeleteHospital(hospital)}
                          disabled={deletingHospitalId === hospital.id}
                          className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md text-xs font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {deletingHospitalId === hospital.id ? '削除中...' : '削除'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {renderModal(isCreateModalOpen, '新しい事業所を登録', handleCreateHospital)}
      {renderModal(isEditModalOpen, '事業所情報を編集', handleEditHospital)}
    </div>
  );
};

export default HospitalManagementPage; 