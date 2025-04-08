/**
 * @swagger
 * /api/peerAssessments:
 *   post:
 *     summary: Submit a peer assessment.
 *     description: Allows a user to submit a peer assessment for a group member, rating their involvement, collaboration, leadership, and overall contribution.
 *     tags: [Assessment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *               - groupId
 *               - involvement
 *               - completion
 *               - collaboration
 *               - leadership
 *               - overallContribution
 *             properties:
 *               receiverId:
 *                 type: string
 *                 description: The ID of the user receiving the assessment.
 *               groupId:
 *                 type: string
 *                 description: The ID of the group where the assessment is being conducted.
 *               involvement:
 *                 type: integer
 *                 description: Rating for the receiver's involvement (1-5).
 *               completion:
 *                 type: integer
 *                 description: Rating for the receiver's task completion (1-5).
 *               collaboration:
 *                 type: integer
 *                 description: Rating for the receiver's collaboration (1-5).
 *               leadership:
 *                 type: integer
 *                 description: Rating for the receiver's leadership (1-5).
 *               overallContribution:
 *                 type: integer
 *                 description: Rating for the receiver's overall contribution (1-5).
 *               feedback:
 *                 type: string
 *                 description: Additional feedback on the receiver's performance.
 *     responses:
 *       201:
 *         description: Peer assessment successfully created.
 *       409:
 *         description: Peer assessment already exists.
 *       404:
 *         description: Receiver or group not found.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/selfAssessments:
 *   post:
 *     summary: Submit a self assessment.
 *     description: Allows a user to submit a self assessment
 *     tags: [Assessment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - groupId
 *               - involvement
 *               - completion
 *               - collaboration
 *               - leadership
 *               - overallContribution
 *             properties:
 *               groupId:
 *                 type: string
 *                 description: The ID of the group where the assessment is being conducted.
 *               involvement:
 *                 type: integer
 *                 description: Rating for involvement (1-5).
 *               completion:
 *                 type: integer
 *                 description: Rating for task completion (1-5).
 *               collaboration:
 *                 type: integer
 *                 description: Rating for collaboration (1-5).
 *               leadership:
 *                 type: integer
 *                 description: Rating for leadership (1-5).
 *               overallContribution:
 *                 type: integer
 *                 description: Rating for overall contribution (1-5).
 *               feedback:
 *                 type: string
 *                 description: Additional feedback
 *     responses:
 *       201:
 *         description: Self assessment successfully created.
 *       409:
 *         description: Self assessment already exists.
 *       404:
 *         description: group not found.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/selfAssessments/{id}/status:
 *   get:
 *     summary: Get the self-assessment submission status for a user in a group.
 *     description: Checks whether the currently logged-in user has submitted a self-assessment for a specific group.
 *     tags: [Assessment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the group.
 *     responses:
 *       200:
 *         description: Returns the self-assessment submission status.
 *       404:
 *         description: Group not found.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/peerAssessments/{id}/remaining:
 *   get:
 *     summary: Get the remaining peer assessments for a user in a group.
 *     description: Retrieves the list of users in a group who have not yet been assessed by the currently logged-in user.
 *     tags: [Assessment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the group.
 *     responses:
 *       200:
 *         description: Returns the total peer assessments submitted and the list of unassessed users.
 *       404:
 *         description: Group not found.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/peerAssessments/{id}:
 *   get:
 *     summary: Get assessment data by assignment
 *     description: Get assessment data by assignment
 *     tags: [Assessment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the assignment.
 *     responses:
 *       200:
 *         description: Retreived assessment data
 *       404:
 *         description: Assignment not found.
 *       500:
 *         description: Internal Server Error.
 */