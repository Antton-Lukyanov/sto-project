import axios from "axios";
import {
  Client,
  Car,
  Employee,
  Service,
  Defect,
  RepairOrder,
  Invoice,
} from "../types";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Token management
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

// ==================== АУТЕНТИФИКАЦИЯ ====================
export const login = (login: string, password: string) =>
  api.post<{ token: string; user: { id: number; full_name: string; login: string; role: string } }>(
    "/auth/login",
    { login, password }
  );

export const register = (data: any, password: string) =>
  api.post("/auth/register", { ...data, password });

export const getMe = () => api.get("/auth/me");

// ==================== КЛИЕНТЫ ====================
export const getClients = () => api.get<Client[]>("/clients");
export const getClientById = (id: number) => api.get<Client>(`/clients/${id}`);
export const createClient = (data: Omit<Client, "id" | "cars" | "cars_count" | "created_at">) =>
  api.post<Client>("/clients", data);
export const updateClient = (id: number, data: Partial<Client>) =>
  api.put<Client>(`/clients/${id}`, data);
export const deleteClient = (id: number) => api.delete(`/clients/${id}`);
export const getClientCars = (id: number) => api.get<Car[]>(`/clients/${id}/cars`);

// ==================== АВТОМОБИЛИ ====================
export const getCars = () => api.get<Car[]>("/cars");
export const getCarById = (id: number) => api.get<Car>(`/cars/${id}`);
export const addCarToClient = (clientId: number, data: Omit<Car, "id" | "client_id" | "client_full_name" | "created_at">) =>
  api.post<Car>(`/cars/client/${clientId}`, data);
export const updateCar = (id: number, data: Partial<Car>) =>
  api.put<Car>(`/cars/${id}`, data);
export const deleteCar = (id: number) => api.delete(`/cars/${id}`);
export const getCarByPlate = (plate: string) =>
  api.get<Car>(`/cars/by-plate?plate=${plate}`);

// ==================== РАБОТНИКИ ====================
export const getEmployees = () => api.get<Employee[]>("/employees");
export const getEmployeeById = (id: number) => api.get<Employee>(`/employees/${id}`);
export const createEmployee = (data: Omit<Employee, "id" | "hired_at" | "repairs_count" | "total_earnings">, password: string) =>
  api.post<Employee>("/employees", { ...data, password });
export const updateEmployee = (id: number, data: Partial<Employee>) =>
  api.put<Employee>(`/employees/${id}`, data);
export const deleteEmployee = (id: number) => api.delete(`/employees/${id}`);

// ==================== УСЛУГИ (ПРАЙС-ЛИСТ) ====================
export const getServices = () => api.get<Service[]>("/services");
export const getServiceById = (id: number) => api.get<Service>(`/services/${id}`);
export const createService = (data: Omit<Service, "id" | "total_price">) =>
  api.post<Service>("/services", data);
export const updateService = (id: number, data: Partial<Service>) =>
  api.put<Service>(`/services/${id}`, data);
export const deleteService = (id: number) => api.delete(`/services/${id}`);

// ==================== ДЕФЕКТЫ ====================
export const getDefects = () => api.get<Defect[]>("/defects");
export const getDefectById = (id: number) => api.get<Defect>(`/defects/${id}`);
export const getDefectByCode = (code: string) =>
  api.get<Defect>(`/defects/code/${code}`);
export const getDefectsByCategory = (category: string) =>
  api.get<Defect[]>(`/defects/category/${category}`);
export const createDefect = (data: Omit<Defect, "id">) =>
  api.post<Defect>("/defects", data);
export const updateDefect = (id: number, data: Partial<Defect>) =>
  api.put<Defect>(`/defects/${id}`, data);
export const deleteDefect = (id: number) => api.delete(`/defects/${id}`);

// ==================== РЕМОНТЫ (ЗАКАЗЫ-НАРЯДЫ) ====================
export const getRepairOrders = (archived: boolean = false) =>
  api.get<RepairOrder[]>(`/repair-orders?archived=${archived}`);
export const getRepairOrderById = (id: number) =>
  api.get<RepairOrder>(`/repair-orders/${id}`);
export const createRepairOrder = (data: Omit<RepairOrder, "id" | "created_at" | "total_amount">) =>
  api.post<RepairOrder>("/repair-orders", data);
export const updateRepairOrder = (id: number, data: Partial<RepairOrder>) =>
  api.put<RepairOrder>(`/repair-orders/${id}`, data);
export const deleteRepairOrder = (id: number) => api.delete(`/repair-orders/${id}`);

// Услуги в заказе
export const addServiceToOrder = (orderId: number, serviceId: number, quantity: number, unitPrice: number) =>
  api.post(`/repair-orders/${orderId}/services`, { service_id: serviceId, quantity, unit_price: unitPrice });
export const getOrderServices = (orderId: number) =>
  api.get(`/repair-orders/${orderId}/services`);
export const removeServiceFromOrder = (orderId: number, serviceId: number) =>
  api.delete(`/repair-orders/${orderId}/services/${serviceId}`);

// Дефекты в заказе
export const addDefectToOrder = (orderId: number, defectId: number, notes: string | null) =>
  api.post(`/repair-orders/${orderId}/defects`, { defect_id: defectId, notes });
export const getOrderDefects = (orderId: number) =>
  api.get(`/repair-orders/${orderId}/defects`);
export const removeDefectFromOrder = (orderId: number, defectId: number) =>
  api.delete(`/repair-orders/${orderId}/defects/${defectId}`);

// ==================== СЧЕТА ====================
export const getInvoiceByOrderId = (orderId: number) =>
  api.get<Invoice>(`/invoices/order/${orderId}`);
export const generateInvoice = (orderId: number) =>
  api.post<Invoice>(`/invoices/order/${orderId}/generate`);
export const updateInvoiceStatus = (id: number, status: "pending" | "paid" | "overdue") =>
  api.put<Invoice>(`/invoices/${id}/status`, { status });

// Отчёт для клиента (акт выполненных работ)
export const getClientReport = (orderId: number) =>
  api.get(`/invoices/order/${orderId}/report`);

// ==================== АНАЛИТИЧЕСКИЕ ОТЧЁТЫ ====================
// 1. Кто обслуживал автомобиль
export const getEmployeesByCarPlate = (plate: string) =>
  api.get(`/reports/employees-by-car?plate=${plate}`);

// 2. Автомобили владельца
export const getCarsByClient = (clientId: number) =>
  api.get(`/reports/cars-by-client/${clientId}`);

// 3. Дефекты клиента с ценами
export const getDefectsByClient = (clientId: number) =>
  api.get(`/reports/defects-by-client/${clientId}`);

// 4. Владельцы по типу неисправности
export const getClientsByDefect = (defectCode: string) =>
  api.get(`/reports/clients-by-defect/${defectCode}`);

// 5. Самая частая неисправность марки
export const getTopDefectByBrand = (brand: string) =>
  api.get(`/reports/top-defect?brand=${encodeURIComponent(brand)}`);

// 6. Лучший работник по выработке
export const getTopEmployee = () => api.get("/reports/top-employee");

// Статистика работника (админ)
export const getEmployeeStats = (employeeId: number, startDate?: string, endDate?: string) =>
  api.get(`/reports/employee-stats/${employeeId}`, { params: { startDate, endDate } });

export default api;