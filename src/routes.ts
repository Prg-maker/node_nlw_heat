import {Router} from 'express'

import { ensureAuthenticate } from './middleware/ensureAuthenticate'

import { AuthenticateUserController } from './controllers/AuthenticateUserController'
import { CreateMessageController } from './controllers/CreateMessageController'
import { GetLast3MessagesController } from './controllers/GetLast3MessagesController'
import { ProfileUserController } from './controllers/UserProfileController'
const router = Router()



router.post('/authenticate' , new AuthenticateUserController().handle)
 
router.post('/message', ensureAuthenticate ,new CreateMessageController().handle)

router.get ('/messages/last3' , new GetLast3MessagesController().handle)

router.get('/user' ,  ensureAuthenticate , new ProfileUserController().handle)

export {router}