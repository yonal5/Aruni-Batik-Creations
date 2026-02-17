import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/loader";
import Header, { TtitleBar } from "../../components/header";

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

    axios
      .get(import.meta.env.VITE_API_URL + "/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {

        console.log(response.data);

        setOrders(response.data);

      })
      .catch((error) => {

        console.error("Failed to fetch orders:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }

      })
      .finally(() => {
        setIsLoading(false);
      });

  }, [navigate]);



  return (

    <div className="w-full min-h-full bg-white">
      <div className="mx-auto max-w-7xl p-6">

        <div className="rounded-2xl border border-secondary/10 bg-primary shadow-sm">

          {/* Header */}
          <div className="flex items-center justify-between gap-4 border-b border-secondary/10 px-6 py-4">

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

              <table className="w-full min-w-[880px] text-left">

                <thead className="bg-secondary text-white">

                  <tr>

                    <th className="px-4 py-3 text-xs font-semibold uppercase">
                      Order ID
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase">
                      Number of Items
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase">
                      Customer Name
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

                    <th className="px-4 py-3 text-xs font-semibold uppercase text-center">
                      Date
                    </th>

                  </tr>

                </thead>



                <tbody className="divide-y divide-secondary/10">

                  {orders.length === 0 && (

                    <tr>

                      <td colSpan={9} className="px-4 py-12 text-center">

                        No orders to display.

                      </td>

                    </tr>

                  )}



                  {orders.map((item) => (

                    <tr
                      key={item.orderID}
                      className="odd:bg-white even:bg-primary hover:bg-accent/5"
                    >

                      <td className="px-4 py-3 font-mono">

                        {item.orderID}

                      </td>


                      <td className="px-4 py-3">

                        {item.items?.length || 0} items

                      </td>


                      <td className="px-4 py-3">

                        {item.customerName}

                      </td>


                      <td className="px-4 py-3">

                        {item.email}

                      </td>


                      <td className="px-4 py-3">

                        {item.phone}

                      </td>


                      <td className="px-4 py-3">

                        {item.address}

                      </td>


                      <td className="px-4 py-3">

                        {new Intl.NumberFormat("en-LK", {
                          style: "currency",
                          currency: "LKR",
                        }).format(item.total || 0)}

                      </td>


                      <td className="px-4 py-3 text-center">

                        {item.status}

                      </td>


                      <td className="px-4 py-3 text-center">

                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString("en-LK", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}


