/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a message to a group
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - groupId
 *             properties:
 *               content:
 *                 type: string
 *                 description: The message content
 *                 example: "Hello, team!"
 *               groupId:
 *                 type: string
 *                 format: uuid
 *                 description: The UUID of the group
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/messages/{id}:
 *   get:
 *     summary: Get all messages from a specific group
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The group ID
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *       400:
 *         description: Invalid group ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */
