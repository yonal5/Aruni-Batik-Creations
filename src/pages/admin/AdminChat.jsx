import { useEffect, useRef, useState } from "react";
import axios from "axios";
import mediaUpload from "../../utils/mediaUpload";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminChat() {

const [customers,setCustomers]=useState([]);
const [messages,setMessages]=useState([]);
const [selected,setSelected]=useState(null);

const [text,setText]=useState("");
const [image,setImage]=useState(null);

const chatEndRef=useRef();

// load customers
const loadCustomers=async()=>{
const res=await axios.get(`${BASE_URL}/api/customers`);
setCustomers(res.data);

if(!selected && res.data.length>0)
setSelected(res.data[0].userId);
};

// load messages
const loadMessages=async()=>{
if(!selected)return;

const res=await axios.get(`${BASE_URL}/api/admin?guestId=${selected}`);
setMessages(res.data);
};

useEffect(()=>{
loadCustomers();

const i=setInterval(()=>{
loadCustomers();
loadMessages();
},1500);

return()=>clearInterval(i);

},[selected]);

useEffect(()=>{
chatEndRef.current?.scrollIntoView({behavior:"smooth"});
},[messages]);

// send text
const sendText=async()=>{

if(!text.trim())return;

await axios.post(`${BASE_URL}/api/admin/send`,{
guestId:selected,
message:text,
type:"text"
});

setText("");
loadMessages();
};

// send image
const sendImage=async()=>{

if(!image)return;

const url=await mediaUpload(image);

await axios.post(`${BASE_URL}/api/admin/send`,{
guestId:selected,
imageUrl:url,
type:"image"
});

setImage(null);
loadMessages();
};

return(

<div className="flex h-screen bg-gray-100">

{/* LEFT SIDEBAR */}

<div className="w-80 bg-white border-r">

<h2 className="p-4 font-bold border-b">Chats</h2>

{customers.map(c=>(

<div
key={c.userId}
onClick={()=>setSelected(c.userId)}
className={`p-3 cursor-pointer border-b hover:bg-gray-100
${selected===c.userId?"bg-green-100":""}`}
>

<div className="flex justify-between">

<span>{c.customerName}</span>

{c.unreadCount>0 && ( <span className="bg-green-500 text-white text-xs px-2 rounded-full">
{c.unreadCount} </span>
)}

</div>

</div>

))}

</div>

{/* RIGHT CHAT */}

<div className="flex flex-col flex-1">

{/* messages */}

<div className="flex-1 overflow-y-auto p-4">

{messages.map(m=>(

<div key={m._id}
className={`flex mb-2
${m.sender==="admin"?"justify-end":"justify-start"}`}>

<div className={`
max-w-xs px-3 py-2 rounded-lg
${m.sender==="admin"
?"bg-green-500 text-white"
:"bg-white border"}
`}>

{m.type==="image"
?<img src={m.imageUrl} className="rounded max-w-[200px]" />
:m.message}

</div>

</div>

))}

<div ref={chatEndRef}></div>

</div>

{/* input */}

<div className="p-3 border-t flex gap-2">

<input
type="file"
onChange={e=>setImage(e.target.files[0])}
/>

<input
className="flex-1 border px-3 py-2 rounded"
value={text}
onChange={e=>setText(e.target.value)}
placeholder="Type message"
/>

<button
onClick={sendText}
className="bg-green-500 text-white px-4 rounded"

>

Send </button>

<button
onClick={sendImage}
className="bg-blue-500 text-white px-4 rounded"

>

Image </button>

</div>

</div>

</div>

);
}
