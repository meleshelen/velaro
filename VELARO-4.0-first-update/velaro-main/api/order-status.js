import { json, requireAdmin, supabase } from "./_shared.js";
const allowed=["new","processing","sent","completed","cancelled"];
export default async function handler(req,res){
 if(!requireAdmin(req,res)) return;
 if(req.method!=="PATCH") return json(res,405,{error:"Method not allowed"});
 const {id,status}=req.body||{}; if(!id||!allowed.includes(status)) return json(res,400,{error:"Некоректні дані"});
 try{const rows=await supabase(`orders?id=eq.${encodeURIComponent(id)}`,{method:"PATCH",body:JSON.stringify({status,is_new:false})});return json(res,200,{order:rows[0]});}
 catch(error){return json(res,500,{error:"Не вдалося змінити статус",details:error.message});}
}
