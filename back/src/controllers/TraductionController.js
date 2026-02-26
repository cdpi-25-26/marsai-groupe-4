import fs from 'fs/promises';
import path from 'path';

const locals = path.join(process.cwd("src/locals"),'');

async function getTranslations(req,res){
    try{
        const{lang}=req.params;
        const filePath = path.join(process.cwd(), "src/locals", `${lang}.json`);
        const content = await fs.readFile(filePath, 'utf-8');
        res.json(JSON.parse(content));
    }catch (err){
        res.status(500).json({message:"Error fetching translations"}); 
    }
}


async function updateTranslation(req,res){
    try{
        const {lang}= req.params;
        const {key,value}= req.body;

        if(!key || !value)return res.status(400).json({message:"Key and value are required"});
        
        const filePath = path.join(locals, `${lang}.json`);
        const content = await fs.readFile(filePath, 'utf-8');
        const json = JSON.parse(content);

        json[key]=value;

        await fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8');

        res.json({ success:true, message:`Clé ${key} mise à jour`});
    }catch (err){
        console.error(err);
        res.status(500).json({message:"Error updating translation"});
    }
}

export { getTranslations, updateTranslation };