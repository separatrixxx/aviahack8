from fastapi import APIRouter

router = APIRouter()

@router.get('/{version}')
async def metrics(version):
    return {'message': 'Version: ' + version}
