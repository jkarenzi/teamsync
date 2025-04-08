/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: User signup
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Signup successful
 *       400:
 *         description: Failed Validation
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Failed Validation
 *       401:
 *         description: Incorrect password
 *       404:
 *         description: Account not found
 *       500:
 *         description: Internal Server Error
 */


/**
 * @swagger
 * /api/user/own:
 *   get:
 *     summary: Get the profile of the currently logged-in user.
 *     description: Retrieves the profile details of the authenticated user, including related entities like bookmarks, notes, and reminders.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the user profile.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/user/status/{id}:
 *   patch:
 *     summary: Disactivate or activate user.
 *     description: Disactivates or activates a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to activate or disactivate.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               active:
 *                 type: boolean
 *                 description: User account status
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/user/role/{id}:
 *   patch:
 *     summary: Change user role.
 *     description: Changes user role
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: User role
 *     responses:
 *       200:
 *         description: Successful.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users.
 *     description: Retrieves a list of all users in the system, including related entities like bookmarks and prayer requests.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users.
 *       500:
 *         description: Internal Server Error.
 */


/**
 * @swagger
 * /api/user:
 *   patch:
 *     summary: Edit profile
 *     description: Allows authenticated users to edit their profiles
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: User's full name
 *               profileImg:
 *                 type: string
 *                 description: User's profile image
 *     responses:
 *       200:
 *         description: Successful
 *       500:
 *         description: Internal server error.
 */