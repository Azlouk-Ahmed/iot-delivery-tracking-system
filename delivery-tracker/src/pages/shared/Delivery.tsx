import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { File, Filter, SortDesc, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrdersDataTable } from "./orders-table/ordersDataTable";
import { ordersColumns, type Order } from "./orders-table/ordersColumns";
import { Button } from "@/components/ui/button";
import { SectionCards } from "@/components/base/OrdersSectionCards";
import useFetch from "@/hooks/useFetchData";
import { axiosPublic } from "@/api/axios";
import { useAuthContext } from "@/hooks/useAuthContext";
import { toast } from "sonner";
emailjs.init("5ddo6PQPTT7fIycvW");

function OrdersPage() {
  // Fetch required data
  const {user} = useAuthContext();
  const { data: userData } = useFetch("/auth/admin-data", { immediate: true });
  const { data: companiesData } = useFetch("/companies/all", { immediate: true });
  const { data: usersData } = useFetch("/auth/all", { immediate: true });
  const { data: vehiclesData } = useFetch("/vehicle/all", { immediate: true });
  const { data: vehiclesDataAdmin } = useFetch(`/vehicle/admin/${userData?.companies?._id}`, { immediate: true });
  const { data: deliveriesData, refetch: refetchDeliveries } = useFetch("/delivery", { immediate: true, });
  const { data: deliveriesDataAdmin } = useFetch(`/delivery/company/${userData?.companies?._id}`, { immediate: true });
  console.log("deliveriesDataAdmin",deliveriesDataAdmin);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showDelivered, setShowDelivered] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    userId: "",
    companyId:"",
    vehicleId: "",
    status: "pending" as const,
  });

  useEffect(() => {
    if(userData?.companies?._id){
      setFormData((prev) => ({ ...prev, companyId: userData.companies._id }));
    }
  }, [userData]);

  const [products, setProducts] = useState([
    { product: "", qty: 1, price: 0 },
  ]);

useEffect(() => {
  let sourceData = null;

  if (!userData?.companies?._id && deliveriesData?.success) {
    sourceData = deliveriesData.deliveries;
  } else if (userData?.companies?._id && deliveriesDataAdmin?.success) {
    sourceData = deliveriesDataAdmin.deliveries;
  }

  if (sourceData) {
    const mappedOrders: Order[] = sourceData.map((d: any) => ({
      id: d._id,
      email: d.user?.email || "N/A",
      user: d.user?.name || "Unknown",
      company: d.company?.name || "Unknown",
      vehicleId: d.vehicleId?.plateNumber || d.vehicleId?._id || "N/A",
      status: d.status,
      products: d.products || [],
      date: Date.now(),
    }));

    setOrders(mappedOrders);
  }
}, [deliveriesData, deliveriesDataAdmin, userData]);


  const filteredOrders = showDelivered
    ? orders
    : orders.filter((order) => order.status !== "delivered");

  const addProduct = () => {
    setProducts([...products, { product: "", qty: 1, price: 0 }]);
  };

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };

  const updateProduct = (index: number, field: keyof typeof products[0], value: any) => {
    const updated = [...products];
    if (field === "qty") value = parseInt(value) || 1;
    if (field === "price") value = parseFloat(value) || 0;
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

 

const handleSubmit = async () => {
  try {
    // Validate required fields
    if (!formData.userId) {
      toast.error("Please select a user");
      return;
    }

    if (!formData.companyId) {
      toast.error("Please select a company");
      return;
    }

    if (!formData.vehicleId) {
      toast.error("Please select a vehicle");
      return;
    }

    const filteredProducts = products
      .filter((p) => p.product.trim() !== "")
      .map((p) => ({
        product: p.product,
        qty: p.qty,
        price: p.price,
      }));

    if (filteredProducts.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    const payload = {
      user: formData.userId,
      email:
        usersData?.users.find((u: any) => u._id === formData.userId)?.email ||
        "",
      company: formData.companyId,
      vehicleId: formData.vehicleId,
      status: formData.status,
      products: filteredProducts,
    };

    console.log("Payload being sent:", payload);

    // 1️⃣ Create Delivery
    const response = await axiosPublic.post("/delivery", payload);
    console.log("Delivery created:", response.data);

    // 2️⃣ Send Email Notification
    await emailjs.send("service_ztho70b", "template_ybf67te", {
      title: "Your Order Has Been Successfully Placed",
      name:
        usersData?.users.find((u: any) => u._id === formData.userId)?.name ||
        "Customer",
      time: new Date().toLocaleString(),
      message:
        "Your delivery request has been received. You will be able to track your order as soon as the driver updates the status to 'shipping'.",
      email: payload.email,
    });

    console.log("Email sent successfully");

    // 3️⃣ Refetch list
    await refetchDeliveries();

    // 4️⃣ Reset form
    setFormData({
      userId: "",
      companyId: userData?.companies?._id || "",
      vehicleId: "",
      status: "pending",
    });
    setProducts([{ product: "", qty: 1, price: 0 }]);

    toast.success("Delivery created successfully!");
  } catch (error: any) {
    console.error("Error creating delivery:", error);
    toast.error(error.response?.data?.message || "Failed to create delivery");
  }
};



  return (
    <div className="p-10">
      <SectionCards />
      <div className="flex py-5 justify-between items-center">
        <h1 className="text-2xl font-semibold">Delivery Orders</h1>

        <div className="flex gap-6 items-center">
          <span className="flex gap-3 items-center">
            <Filter size={15} /> Filter
          </span>
          <span className="flex gap-3 items-center">
            <SortDesc size={15} /> Sort
          </span>
          <span className="flex gap-3 items-center">
            <Label htmlFor="delivered" className="cursor-pointer">
              Show delivered
            </Label>
            <Switch
              id="delivered"
              checked={showDelivered}
              onCheckedChange={setShowDelivered}
            />
          </span>
          <span className="flex gap-3 items-center">
            <File size={15} /> Export
          </span>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Add New Delivery</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Delivery</DialogTitle>
                <DialogDescription>
                  Fill in the delivery details below.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* User Select */}
                <div className="grid gap-2">
                  <Label>User</Label>
                  <Select
                    value={formData.userId}
                    onValueChange={(value) => setFormData({ ...formData, userId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {usersData?.success &&
                        usersData.users.map((user: any) => (
                          <SelectItem key={user._id} value={user._id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Company Select */}
                {user?.role === "super_admin" &&<div className="grid gap-2">
                  <Label>Company</Label>
                  <Select
                    value={formData.companyId}
                    onValueChange={(value) => setFormData({ ...formData, companyId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companiesData &&
                        companiesData.map((company: any) => (
                          <SelectItem key={company._id} value={company._id}>
                            {company.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>}

                {/* Vehicle Select */}
                <div className="grid gap-2">
                  <Label>Vehicle</Label>
                  <Select
                    value={formData.vehicleId}
                    onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    {user?.role === "super_admin" &&<SelectContent>
                      {vehiclesData?.success &&
                        vehiclesData.data.map((vehicle: any) => (
                          <SelectItem key={vehicle._id} value={vehicle._id}>
                            {vehicle.model} ({vehicle.plateNumber})
                          </SelectItem>
                        ))}
                    </SelectContent>}
                    {user?.role === "admin" &&<SelectContent>
                      {vehiclesDataAdmin?.success &&
                        vehiclesDataAdmin.data.map((vehicle: any) => (
                          <SelectItem key={vehicle._id} value={vehicle._id}>
                            {vehicle.model} ({vehicle.plateNumber})
                          </SelectItem>
                        ))}
                    </SelectContent>}
                  </Select>
                </div>

                {/* Status */}
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Products */}
                <div className="space-y-3">
                  <Label>Products</Label>
                  {products.map((product, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_100px_120px_40px] gap-3 items-end"
                    >
                      <Select
                        value={product.product}
                        onValueChange={(value) => updateProduct(index, "product", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="p1">Product A</SelectItem>
                          <SelectItem value="p2">Product B</SelectItem>
                          <SelectItem value="p3">Product C</SelectItem>
                          <SelectItem value="p4">Product D</SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        type="number"
                        placeholder="Qty"
                        min={1}
                        value={product.qty}
                        onChange={(e) => updateProduct(index, "qty", e.target.value)}
                      />

                      <Input
                        type="number"
                        placeholder="Price"
                        min={0}
                        step="0.01"
                        value={product.price || ""}
                        onChange={(e) => updateProduct(index, "price", e.target.value)}
                      />

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeProduct(index)}
                        disabled={products.length === 1}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}

                  <Button variant="outline" onClick={addProduct} className="w-full">
                    + Add Another Product
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSubmit}>Save Delivery</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <OrdersDataTable columns={ordersColumns} data={filteredOrders} />
    </div>
  );
}

export default OrdersPage;