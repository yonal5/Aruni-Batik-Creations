import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/loader";
import Header, { TtitleBar } from "../components/header";

export default function AdminOrdersPage() {

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();


  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadOrders(token);

  }, [navigate]);


  async function loadOrders(token) {

    try {

      setIsLoading(true);

      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data || []);

    }
    catch (error) {

      console.error("Failed to fetch orders:", error);

    }
    finally {

      setIsLoading(false);

    }

  }



  return (

    <div className="w-full min-h-screen bg-white">

      <Header />

      <TtitleBar />


      <div className="mx-auto max-w-7xl p-6">

        <div className="rounded-2xl border border-secondary/10 bg-primary shadow-sm">

          {/* Header */}

          <div className="flex items-center justify-between border-b border-secondary/10 px-6 py-4">

            <h1 className="text-lg font-semibold text-secondary">
              Orders
            </h1>

            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {orders.length} orders
            </span>

          </div>



          {/* Table */}

          <div className="overflow-x-auto">

            {isLoading ? (

              <Loader />

            ) : (

              <table className="w-full min-w-[900px] text-left">

                <thead className="bg-secondary text-white">

                  <tr>

                    <th className="px-4 py-3 text-xs font-semibold uppercase">
                      Order ID
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase">
                      Items
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase">
                      Customer
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase">
                      Email
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase">
                      Phone
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase">
                      Address
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase">
                      Total
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase text-center">
                      Status
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase">
                      Date
                    </th>

                  </tr>

                </thead>



                <tbody className="divide-y divide-secondary/10">

                  {orders.length > 0 ? (

                    orders.map((item, index) => (

                      <tr
                        key={item.orderID || index}
                        className="odd:bg-white even:bg-primary hover:bg-accent/5 transition"
                      >

                        <td className="px-4 py-3 font-mono text-sm">
                          {item.orderID || "-"}
                        </td>


                        <td className="px-4 py-3">
                          {item.items?.length || 0}
                        </td>


                        <td className="px-4 py-3">
                          {item.customerName || "-"}
                        </td>


                        <td className="px-4 py-3">
                          {item.email || "-"}
                        </td>


                        <td className="px-4 py-3">
                          {item.phone || "-"}
                        </td>


                        <td className="px-4 py-3 max-w-[200px] truncate">
                          {item.address || "-"}
                        </td>


                        <td className="px-4 py-3 font-medium">

                          {new Intl.NumberFormat("en-LK", {
                            style: "currency",
                            currency: "LKR",
                          }).format(item.total || 0)}

                        </td>


                        <td className="px-4 py-3 text-center">

                          <span className="
                            px-2 py-1 rounded-md text-xs font-medium
                            bg-accent/10 text-accent
                          ">

                            {item.status || "Pending"}

                          </span>

                        </td>


                        <td className="px-4 py-3 text-sm text-secondary/70">

                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleString("en-LK")
                            : "-"}

                        </td>


                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td colSpan="9" className="text-center py-10 text-secondary/60">

                        No orders found

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}
