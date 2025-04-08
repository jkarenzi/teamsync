/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get notifications
 *     description: Get notifications for currently logged in user
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful.
 *       500:
 *         description: Internal Server Error.
 */


/**
 * @swagger
 * /api/notifications/{id}:
 *   patch:
 *     summary: Mark notification as read
 *     description: Marks notification as read
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the notification.
 *     responses:
 *       200:
 *         description: Successful.
 *       404:
 *         description: Notification not found.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/notifications:
 *   patch:
 *     summary: Mark all notifications as read
 *     description: Marks all notifications as read
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful.
 *       500:
 *         description: Internal Server Error.
 */