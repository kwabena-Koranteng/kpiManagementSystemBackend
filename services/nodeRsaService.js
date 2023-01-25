const NodeRSA = require('node-rsa');

class NodeRsaService {
    decrypt(payload , privatekey){
        const key = new NodeRSA({b:1024})

        key.importKey(privatekey , 'pkcs8-private');

        const isPrivateKey  = key.isPrivate();

        return key.decrypt(payload.data , 'utf8');

    }
}

module.exports = NodeRsaService;