
import express from 'express';
// import { instance } from 'gaxios';

//Zod é uma biblioteca de declaração e validação de esquema TypeScript-first
import { z, ZodError } from 'zod'

import sheets, { SHEET_ID } from './sheetClient.js';


const app = express();


//elimina declarações de tipo duplicadas
const soyFormSchema = z.object({
    area_damaged: z.number(),
    canker_lesion: z.number(),
    crop_hist: z.number(),
    date: z.number(),
    external_decay: z.number(),
    fruit_spots: z.number(),
    fruiting_bodies: z.number(),
    fruit_pods: z.number(),
    germination: z.number(),
    hail: z.number(),
    int_discolor: z.number(),
    leaf_malf: z.number(),
    leaf_mild: z.number(),
    leaf_shread: z.number(),
    leafspots_halo: z.number(),
    leafspot_size: z.number(),
    leafspots_marg: z.number(),
    leaves: z.number(),
    lodging: z.number(),
    mold_growth: z.number(),
    mycelium: z.number(),
    plant_growth: z.number(),
    plant_stand: z.number(),
    precip: z.number(),
    roots: z.number(),
    sclerotia: z.number(),
    seed: z.number(),
    seed_discolor: z.number(),
    seed_size: z.number(),
    seed_tmt: z.number(),
    severity: z.number(),
    shriveling: z.number(),
    stem: z.number(),
    stem_cankers: z.number(),
    temp: z.number()
})

//express.json() é uma função de middleware integrado no Express
//analisa conjuntos de dados JSON, texto, codificados em URL em um body request em HTTP
//analisa solicitações JSON recebidas e coloca os dados analisados ​​em req.body

app.use(express.json());

//para acessar os arquivos da pasta 'public' via HTTP
app.use(express.static('public'));


//definição do request handler(controlador)
app.post('/send-message', async (req, res) => {

    try{
      
    //req.body contém pares chave-valor de dados enviados no corpo da solicitação
    //por padrão, ele é indefinido e preenchido quando é utilizado o middleware chamado body parsing - express.json()
    const body = soyFormSchema.parse(req.body);

    const rows = Object.values(body);

    console.log(rows);
    

    //anexa valores a planilha de casos
    await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'Página1!D313:AL313',
        //determina como os dados existentes são alterados quando novos dados são inseridos
        insertDataOption: 'OVERWRITE',
        //determina como os dados de entrada devem ser interpretados.
        valueInputOption: 'RAW',
        requestBody: {
          values: [rows],
        },
      });

      res.json({ message: 'Data added successfully' });


    } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(400).json({ error });
        }
    }
});

app.listen(5000, () => console.log(`App running on http://localhost:5000`));


