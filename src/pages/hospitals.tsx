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
}

const HospitalManagementPage = () => {
  const router = useRouter();
  
  // State
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
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
    address: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // Form handling
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Modal handlers
  const openCreateModal = () => {
    setFormData({ name: '', address: '' });
    setErrors({});
    setIsCreateModalOpen(true);
  };

  const openEditModal = (hospital: Hospital) => {
    setEditingHospital(hospital);
    setFormData({
      name: hospital.name,
      address: hospital.address || ''
    });
    setErrors({});
    setIsEditModalOpen(true);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setEditingHospital(null);
    setFormData({ name: '', address: '' });
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
        address: formData.address.trim() || undefined
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
        address: formData.address.trim() || undefined
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
          
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

          {/* Hospital List */}
          <div className="p-6">
            {hospitals.length === 0 ? (
              <div className="text-center py-12">
                                 <div className="text-gray-500 text-lg">登録されている事業所がありません</div>
                 <p className="text-gray-400 text-sm mt-2">上のボタンから新しい事業所を登録してください</p>
                <button
                  onClick={openCreateModal}
                  className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                                     事業所を登録
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hospitals.map(hospital => (
                  <div key={hospital.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
                          <p className="text-sm text-gray-500">ID: {hospital.id}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">住所:</span> {hospital.address || '未設定'}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(hospital)}
                        className="flex-1 px-3 py-2 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200 transition-colors"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDeleteHospital(hospital)}
                        disabled={deletingHospitalId === hospital.id}
                        className="flex-1 px-3 py-2 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {deletingHospitalId === hospital.id ? '削除中...' : '削除'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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