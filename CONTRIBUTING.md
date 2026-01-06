# Contributing to TeamCollab

First off, thank you for considering contributing to TeamCollab! It's people like you that make TeamCollab such a great tool.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List some examples of how it would be used**

### Your First Code Contribution

Unsure where to begin? You can start by looking through `beginner` and `help-wanted` issues:

- **Beginner issues** - issues which should only require a few lines of code
- **Help wanted issues** - issues which should be a bit more involved

### Pull Requests

- Fill in the required template
- Follow the style guidelines
- Include screenshots and animated GIFs in your pull request whenever possible
- End all files with a newline
- Avoid platform-dependent code

## Development Setup

### Prerequisites

- Node.js 18+
- MongoDB
- Git

### Setup Steps

1. Fork the repo and clone your fork:
```bash
git clone https://github.com/your-username/teamcollab.git
cd teamcollab
```

2. Install dependencies for both client and server:
```bash
# Install server dependencies
cd teamcollab-server
npm install

# Install client dependencies
cd ../teamcollab-client
npm install
```

3. Create `.env` files (see README.md for details)

4. Start the development servers:
```bash
# Terminal 1 - Start backend
cd teamcollab-server
npm run dev

# Terminal 2 - Start frontend
cd teamcollab-client
npm run dev
```

### Making Changes

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

2. Make your changes and test thoroughly

3. Commit your changes (see commit message guidelines below)

4. Push to your fork:
```bash
git push origin feature/your-feature-name
```

5. Open a Pull Request

## Pull Request Process

1. **Update the README.md** with details of changes if applicable
2. **Update documentation** for any new features
3. **Add tests** if you're adding functionality
4. **Ensure all tests pass** before submitting
5. **Follow the code style** of the project
6. **Update the CHANGELOG.md** with a note describing your changes
7. The PR will be merged once you have the sign-off of at least one maintainer

### PR Checklist

Before submitting your PR, make sure:

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Code is commented, particularly in hard-to-understand areas
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated and all pass
- [ ] Changes work on different screen sizes (if UI changes)
- [ ] Changes tested in different browsers (if applicable)

## Style Guidelines

### JavaScript/React Style Guide

- Use ES6+ features
- Use functional components with hooks
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Use PropTypes or TypeScript for type checking
- Follow React best practices

#### Example:
```javascript
// Good
const fetchUserData = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Bad
const x = async (id) => {
  const r = await api.get(`/users/${id}`);
  return r.data;
};
```

### CSS/Tailwind Style Guide

- Use Tailwind utility classes
- Keep custom CSS minimal
- Use semantic class names for custom CSS
- Group related utilities together
- Use responsive design utilities

#### Example:
```jsx
// Good
<div className="flex items-center justify-between p-4 rounded-lg bg-white shadow-md">
  <h2 className="text-lg font-semibold text-gray-800">Title</h2>
  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
    Action
  </button>
</div>

// Bad
<div className="flex items-center justify-between p-4 rounded-lg bg-white shadow-md text-lg font-semibold text-gray-800">
  Title
</div>
```

### File Structure

- Keep components in separate files
- Group related components in folders
- Use index.js for folder exports
- Keep utility functions in separate files

## Commit Message Guidelines

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect the code meaning (formatting, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

### Examples

```bash
feat(dashboard): add project statistics widget

Add a new widget to display project completion statistics.
Includes pie chart and progress bars.

Closes #123
```

```bash
fix(tasks): resolve drag and drop issue on mobile

Fixed an issue where tasks couldn't be dragged on touch devices.
Added touch event handlers.

Fixes #456
```

```bash
docs(readme): update installation instructions

Added MongoDB setup steps and clarified environment variables.
```

## Questions?

Feel free to open an issue with your question or reach out to the maintainers directly.

## Recognition

Contributors will be added to the README.md file and acknowledged in release notes.

---

Thank you for contributing to TeamCollab! 🎉
