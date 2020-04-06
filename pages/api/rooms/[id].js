export default async (req, res) => {
    switch (req.method) {
        case 'GET':
            await handleGET(req, res);
            break;
        case 'PATCH':
            await handlePATCH(req, res);
            break;
        case 'DELETE':
            await handleDELETE(req, res);
            break;
        default:
            res.status(405);
            break;
    }
}

async function handleGET(req, res) {
    
}

async function handlePATCH(req, res) {

}

async function handleDELETE(req, res) {

}
