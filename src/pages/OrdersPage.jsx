import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Loader } from "../components/loader";
import Header, { TtitleBar } from "../components/header";

export default function AdminOrdersPage() {

  const [orders, setOrders] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();


  /*
  LOAD ORDERS FUNCTION
  */
  async function loadOrders() {

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      setIsLoading(true);

      const response = await axios.get(

        import.meta.env.VITE_API_URL + "/api/orders",

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      );

      setOrders(response.data);

    }
    catch (error) {

      console.error("Failed to fetch orders:", error);

      if (error.response?.status === 401) {

        localStorage.removeItem("token");

        navigate("/login");

      } else {

        alert("Failed to load orders");

      }

    }
    finally {

      setIsLoading(false);

    }

  }


  /*
  RUN ONLY ONCE
  */
  useEffect(() => {

    loadOrders();

  }, []);


  return (

    <div className="w-full min-h-full bg-white">

      <Header />

      <TtitleBar />

      <div className="mx-auto max-w-7xl p-6">

        <div className="rounded-2xl border border-secondary/10 bg-primary shadow-sm">


          <div className="flex items-center justify-between gap-4 border-b border-secondary/10 px-6 py-4">

            <h1 className="text-lg font-semibold text-secondary">

              Orders

            </h1>

            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">

              {orders.length} orders

            </span>

          </div>



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

                      Items

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

                    <th className="px-4 py-3 text-xs font-semibold uppercase">

                      Status

                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase">

                      Date

                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-secondary/10">

                  {orders.length === 0 && (

                    <tr>

                      <td
                        colSpan={9}
                        className="px-4 py-12 text-center text-secondary/60"
                      >

                        No orders found

                      </td>

                    </tr>

                  )}


                  {orders.map((order) => (

                    <tr

                      key={order.orderID}

                      className="odd:bg-white even:bg-primary hover:bg-accent/5"

                    >

                      <td className="px-4 py-3 font-mono">

                        {order.orderID}

                      </td>

                      <td className="px-4 py-3">

                        {order.items?.length || 0}

                      </td>

                      <td className="px-4 py-3">

                        {order.customerName}

                      </td>

                      <td className="px-4 py-3">

                        {order.email}

                      </td>

                      <td className="px-4 py-3">

                        {order.phone}

                      </td>

                      <td className="px-4 py-3">

                        {order.address}

                      </td>

                      <td className="px-4 py-3">

                        {new Intl.NumberFormat("en-LK", {

                          style: "currency",

                          currency: "LKR"

                        }).format(order.total || 0)}

                      </td>

                      <td className="px-4 py-3">

                        {order.status}

                      </td>

                      <td className="px-4 py-3">

                        {order.date
                          ? new Date(order.date).toLocaleDateString()
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
