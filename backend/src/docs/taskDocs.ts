/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Complete project report"
 *               status:
 *                 type: string
 *                 enum: [to_do, in_progress, completed]
 *                 example: "to_do"
 *               priorityLevel:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: "high"
 *               groupId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               userId:
 *                 type: string
 *                 example: "321e4567-e89b-12d3-a456-426614174999"
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-10T23:59:00Z"
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Group or User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/tasks/group/{groupId}:
 *   get:
 *     summary: Get all tasks assigned to a specific group
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: The group ID
 *     responses:
 *       200:
 *         description: List of tasks for the group
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/tasks/user:
 *   get:
 *     summary: Get all tasks assigned to the logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks for the user
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Update project report"
 *               status:
 *                 type: string
 *                 enum: [to_do, in_progress, completed]
 *                 example: "to_do"
 *               priorityLevel:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: "medium"
 *               userId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174111"
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-15T23:59:00Z"
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */