import multer from 'multer';
import { NextFunction, Request, Response } from 'express';
import { ErroApi } from '../middlewares/erros';

const limite = 2 * 1024 * 1024;
const receber = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: limite, files: 1, fields: 0 }
}).single('foto');

export function receberFoto(requisicao: Request, resposta: Response, proximo: NextFunction) {
  receber(requisicao, resposta, (falha: unknown) => {
    if (falha instanceof multer.MulterError) {
      return proximo(new ErroApi(400, falha.code === 'LIMIT_FILE_SIZE'
        ? 'Escolha uma foto de até 2 MB.'
        : 'Envie somente uma foto.'));
    }
    proximo(falha);
  });
}

export function fotoComoUri(foto: Buffer | null | undefined): string | null {
  if (!foto) return null;
  const jpeg = foto.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  const png = foto.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (!jpeg && !png) return null;
  return `data:image/${jpeg ? 'jpeg' : 'png'};base64,${foto.toString('base64')}`;
}
