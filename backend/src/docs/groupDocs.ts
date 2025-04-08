/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Group details for creation
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assignmentId
 *               - userIds
 *               - name
 *             properties:
 *               assignmentId:
 *                 type: string
 *                 description: The assignment ID the group belongs to
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: User ID to be assigned to the group
 *               name:
 *                 type: string
 *                 description: The name of the group
 *     responses:
 *       201:
 *         description: Group created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden, only instructors are allowed
 */

/**
 * @swagger
 * /api/groups/{assignmentId}:
 *   get:
 *     summary: Get all groups for a specific assignment
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         description: The ID of the assignment to get groups for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved groups for the assignment
 *       404:
 *         description: No groups found for the assignment
 *       401:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /api/groups/{assignmentId}/own:
 *   get:
 *     summary: Get the group for a specific assignment, for the currently logged in student
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         description: The ID of the assignment
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved group
 *       404:
 *         description: No group found for the assignment
 *       401:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /api/groups/{id}:
 *   patch:
 *     summary: Update a group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the group to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Group details to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the group
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: User ID to be assigned to the group
 *     responses:
 *       200:
 *         description: Group updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden, only instructors are allowed
 *       404:
 *         description: Group not found
 */

/**
 * @swagger
 * /api/groups/{id}:
 *   delete:
 *     summary: Delete a group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the group to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group deleted successfully
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden, only instructors are allowed
 *       404:
 *         description: Group not found
 */

/**
 * @swagger
 * /api/groups/auto-assign:
 *   post:
 *     summary: Automatically assign users to groups
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: List of users and group size for auto-assignment
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assignmentId
 *               - userIds
 *               - groupSize
 *             properties:
 *               assignmentId:
 *                 type: string
 *                 description: The assignment ID for which groups are being created
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: List of user IDs to assign to groups
 *               groupSize:
 *                 type: integer
 *                 description: Number of users in each group
 *     responses:
 *       201:
 *         description: Users assigned to groups successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden, only instructors are allowed
 *       404:
 *         description: Users or assignment not found
 */