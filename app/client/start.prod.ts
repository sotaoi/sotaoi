import express from 'express';
import path from 'path';

const app = express();
const publicPath = path.resolve(__dirname, 'build');

app.use(express.static(publicPath));
app.get('*', function (req: any, res: any) {
  res.sendFile(publicPath + '/index.html');
});

app.listen(process.env.PORT || '8080');
