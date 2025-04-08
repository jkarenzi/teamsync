/**
 * @swagger
 * /api/classes:
 *   post:
 *     summary: Create a new class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - userIds
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the class
 *                 example: "Math 101"
 *               description:
 *                 type: string
 *                 description: A description of the class
 *                 example: "An introductory math class"
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: List of user IDs to assign to the class
 *                 example: ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"]
 *     responses:
 *       201:
 *         description: Class created successfully
 *       400:
 *         description: Class with this name already exists or validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/classes/{id}:
 *   put:
 *     summary: Update an existing class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the class to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the class
 *                 example: "Math 102"
 *               description:
 *                 type: string
 *                 description: The new description of the class
 *                 example: "An advanced math class"
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: List of user IDs to assign to the class
 *                 example: ["550e8400-e29b-41d4-a716-446655440002"]
 *     responses:
 *       200:
 *         description: Class updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Class not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/classes/{id}:
 *   delete:
 *     summary: Delete an existing class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the class to delete
 *     responses:
 *       200:
 *         description: Class deleted successfully
 *       404:
 *         description: Class not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/classes:
 *   get:
 *     summary: Get a list of all classes
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Classes retrieved successfully
 *       500:
 *         description: Internal server error
 */