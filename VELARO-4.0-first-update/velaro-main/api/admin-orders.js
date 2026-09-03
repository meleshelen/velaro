import { json, requireAdmin, supabase } from "./_shared.js";
export default async function handler(req,res){
  if(!requireAdmin(req,res)) return;
  if(req.method!=="GET") return json(res,405,{error:"Method not allowed"});
  try{const orders=await supabase("orders?select=*&order=created_at.desc&limit=500",{method:"GET"});return json(res,200,{orders});}
  catch(error){return json(res,500,{error:"Не вдалося завантажити замовлення",details:error.message});}
}
