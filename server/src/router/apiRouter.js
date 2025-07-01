import { Router } from 'express'
import healthController from '../controller/Health/health.controller.js'
import quickerController from '../controller/Quicker/quicker.controller.js'

const router = Router()

router.route('/self').get(healthController.self)
router.route('/health').get(healthController.health)

router.route('/quicker/self').get(quickerController.self)
router.route('/quicker/displayName').post(quickerController.displayName)

export default router