#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class LinkChecker {
  constructor() {
    this.errors = [];
    this.knowledgebaseFiles = new Set();
  }

  // Scan for all markdown files in the knowledgebase
  scanKnowledgebaseFiles(dir = '.') {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory() && file.name !== 'node_modules' && file.name !== '.git') {
        this.scanKnowledgebaseFiles(fullPath);
      } else if (file.isFile() && file.name.endsWith('.md')) {
        // Store relative path from root
        const relativePath = path.relative('.', fullPath);
        this.knowledgebaseFiles.add(relativePath);
        this.knowledgebaseFiles.add(file.name); // Also store just filename for relative links
      }
    }
  }

  // Extract all markdown links from content
  extractLinks(content, filePath) {
    const links = [];
    
    // Match markdown links: [text](url)
    const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    let lineNumber = 1;
    
    // Track line numbers
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
      let lineMatch;
      
      while ((lineMatch = lineRegex.exec(line)) !== null) {
        const [fullMatch, text, url] = lineMatch;
        
        // Only check internal links (not http/https/mailto etc.)
        if (!url.match(/^(https?|mailto|ftp):/)) {
          links.push({
            text: text,
            url: url,
            line: i + 1,
            column: lineMatch.index + 1,
            filePath: filePath
          });
        }
      }
    }
    
    // Also check for bracketed references like [tags.md]
    const bracketRegex = /\[([^\]]+\.md)\]/g;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let bracketMatch;
      const lineBracketRegex = /\[([^\]]+\.md)\]/g;
      
      while ((bracketMatch = lineBracketRegex.exec(line)) !== null) {
        const [fullMatch, filename] = bracketMatch;
        
        links.push({
          text: filename,
          url: filename,
          line: i + 1,
          column: bracketMatch.index + 1,
          filePath: filePath
        });
      }
    }
    
    return links;
  }

  // Validate a single link
  validateLink(link) {
    let targetPath = link.url;
    
    // Handle different link formats
    if (targetPath.startsWith('/')) {
      // Absolute path from root
      targetPath = targetPath.substring(1);
    } else {
      // Relative path - resolve relative to the current file's directory
      const currentDir = path.dirname(link.filePath);
      targetPath = path.join(currentDir, targetPath);
    }
    
    // Normalize path separators
    targetPath = targetPath.replace(/\\/g, '/');
    
    // Check if target exists (try both with and without .md extension)
    const pathsToCheck = [
      targetPath,
      targetPath + '.md',
      path.basename(targetPath), // Just filename for relative references
      path.basename(targetPath) + '.md'
    ];
    
    let found = false;
    for (const checkPath of pathsToCheck) {
      if (this.knowledgebaseFiles.has(checkPath) || fs.existsSync(checkPath)) {
        found = true;
        break;
      }
    }
    
    if (!found) {
      this.errors.push({
        file: link.filePath,
        line: link.line,
        column: link.column,
        message: `Dangling link: "${link.url}" -> target not found`,
        linkText: link.text
      });
    }
  }

  // Check all links in a file
  checkFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const links = this.extractLinks(content, filePath);
      
      for (const link of links) {
        this.validateLink(link);
      }
    } catch (error) {
      this.errors.push({
        file: filePath,
        line: 1,
        column: 1,
        message: `Error reading file: ${error.message}`,
        linkText: ''
      });
    }
  }

  // Main function to check all links
  checkAllLinks() {
    this.scanKnowledgebaseFiles();
    
    for (const filePath of this.knowledgebaseFiles) {
      if (fs.existsSync(filePath)) {
        this.checkFile(filePath);
      }
    }
    
    // Report results - only output when there are errors
    if (this.errors.length > 0) {
      for (const error of this.errors) {
        console.log(`${error.file}:${error.line}:${error.column} - ${error.message}`);
      }
      return false;
    }
    
    return true;
  }
}

// Run the link checker
if (require.main === module) {
  const checker = new LinkChecker();
  const success = checker.checkAllLinks();
  process.exit(success ? 0 : 1);
}

module.exports = LinkChecker;