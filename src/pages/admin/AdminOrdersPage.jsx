import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header, { TtitleBar } from "../../components/header";
import { Loader } from "../../components/loader";
import OrderModal from "../../components/orderInfoModal";

export default function AdminOrdersPage() {

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
            Authorization: `Bearer ${token}`,
          },
          timeout: 15000,
        }
      );

      setOrders(response.data || []);

    }
    catch (err) {

      console.error(err);

      if (err.response?.status === 401) {

        localStorage.removeItem("token");
        navigate("/login");

      }
      else {

        console.log("Server sleeping or network issue");

      }

    }
    finally {

      setIsLoading(false);

    }

  }


  /*
  LOAD ONCE
  */
  useEffect(() => {

    loadOrders();

  }, []);



  /*
  OPEN MODAL
  */
  function openOrder(order) {

    setSelectedOrder(order);
    setIsModalOpen(true);

  }



  return (

    <div className="w-full min-h-screen bg-primary">

      <Header />
      <TtitleBar title="Orders Management" />


      {/* MODAL */}
      <OrderModal
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        selectedOrder={selectedOrder}
        refresh={loadOrders}
      />


      {/* PAGE CONTAINER */}
      <div className="mx-auto max-w-7xl p-4 sm:p-6">

        <div className="rounded-2xl border border-secondary/10 bg-white shadow-sm overflow-hidden">


          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-secondary/10 px-4 sm:px-6 py-4">

            <h1 className="text-base sm:text-lg font-semibold text-secondary">

              Orders

            </h1>

            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">

              {orders.length} orders

            </span>

          </div>



          {/* TABLE */}
          <div className="overflow-x-auto">

            {isLoading ? (

              <div className="p-10">
                <Loader />
              </div>

            ) : (

              <table className="w-full min-w-[900px] text-left">

                {/* TABLE HEAD */}
                <thead className="bg-secondary text-white text-xs uppercase">

                  <tr>

                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>

                  </tr>

                </thead>



                {/* TABLE BODY */}
                <tbody className="divide-y divide-secondary/10">

                  {orders.length === 0 && (

                    <tr>

                      <td
                        colSpan={9}
                        className="text-center py-12 text-secondary/60"
                      >
                        No orders found
                      </td>

                    </tr>

                  )}



                  {orders.map((order) => (

                    <tr
                      key={order.orderID}
                      onClick={() => openOrder(order)}
                      className="
                        cursor-pointer
                        hover:bg-accent/5
                        transition-colors
                      "
                    >

                      <td className="px-4 py-3 font-mono text-sm">

                        {order.orderID}

                      </td>


                      <td className="px-4 py-3 text-sm">

                        {order.items?.length || 0}

                      </td>


                      <td className="px-4 py-3 text-sm font-medium">

                        {order.customerName}

                      </td>


                      <td className="px-4 py-3 text-sm text-secondary/80">

                        {order.email}

                      </td>


                      <td className="px-4 py-3 text-sm">

                        {order.phone}

                      </td>


                      <td className="px-4 py-3 text-sm max-w-[200px] truncate">

                        {order.address}

                      </td>


                      <td className="px-4 py-3 text-sm font-semibold text-accent">

                        LKR {(order.total || 0).toFixed(2)}

                      </td>


                      <td className="px-4 py-3 text-sm">

                        <span className="
                          px-2 py-1
                          rounded-lg
                          bg-accent/10
                          text-accent
                          text-xs
                        ">
                          {order.status}
                        </span>

                      </td>


                      <td className="px-4 py-3 text-sm text-secondary/70">

                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString("en-LK")
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
