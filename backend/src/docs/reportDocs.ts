/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Get the contribution report for a group.
 *     description: Retrieves the detailed contribution report for a specified group.
 *     tags: [Reports]
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
 *         description: Successfully retrieved the contribution report.
 *       404:
 *         description: Group not found.
 *       500:
 *         description: Internal Server Error.
 */
