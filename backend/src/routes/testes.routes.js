import { Router } from 'express'
import Cryptr from 'cryptr';

const testesRoutePublic = Router()
testesRoutePublic.get('/', (req, res) => {
   const cryptr = new Cryptr(process.env.PASSWORD_PEPPER);

    const encryptedString = cryptr.encrypt('bacon');
    const decryptedString = cryptr.decrypt(encryptedString);


    res.send({
        'encrypted': encryptedString,
        'decrypted': decryptedString,
        'gerei': '8a58f6e229d62b3d4528dbb7beb2c143cf2afc396fa30389f3857e21cc76055ca153fd291db844177fc2995ca1f414a15c7a261bee165a8f12970798e3b04ffbf17301ca1b261e48f558befb48786df0c41f7810e038887e794660a267ab1619ec63dedcff'
    })
});

testesRoutePublic.get('/teque', (req, res) => {
    //req -- tudo que vem na requisicao 
    // res -- tudo que vai no response
    res.send('oi')
});


const testesRoutePrivate = Router()
testesRoutePrivate.get('/priv', (req, res) => {
    res.json({ message: 'Rota private de testes funcionando!' });
});

const testesRouter = {
    public: testesRoutePublic,
    private: testesRoutePrivate  
}

export default testesRouter
