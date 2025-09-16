# WebnovelSync Chrome Extension

A Chrome extension that synchronizes webnovel chapters across 7 platforms, completely free and open-source.

## Overview

WebnovelSync is a browser extension I developed to solve the problem of manually cross-posting chapters between different webnovel platforms. I originally built this tool for a couple of friends who were tired of the tedious process of publishing the same content across multiple sites, and decided to release it publicly.

## Key Features

**Multi-Platform Support**
- Source platforms: Webnovel, ScribbleHub, AO3, FanFiction.net, RoyalRoad, Wattpad
- Target platforms: All 7 platforms including Inkitt
- Automatic chapter detection and extraction

**Advanced Functionality** 
- Batch processing with configurable sizes (1-5 chapters)
- Smart error handling and retry mechanisms
- Real-time sync progress tracking
- Platform-specific formatting optimization
- Dark/light theme interface

**User Experience**
- Interactive tutorial for new users
- Form validation with real-time feedback
- Toast notifications for status updates
- Collapsible advanced settings
- Auto-save configuration

## Technical Implementation

**Architecture**
- Manifest V3 Chrome Extension
- Service Worker background script
- Content script injection per platform
- Chrome Storage API for settings persistence
- Real-time messaging between components

**Core Technologies**
- JavaScript ES6+ with async/await patterns
- Chrome Extension APIs (storage, scripting, tabs, alarms)
- CSS Grid and Flexbox for responsive UI
- Platform-specific DOM manipulation
- Error handling and retry logic

**Security & Performance**
- Content Security Policy implementation
- Minimal permissions model
- Efficient batch processing algorithms
- Memory-optimized chapter extraction
- Rate limiting to prevent platform blocking

## Installation

Install from the Chrome Web Store: https://chromewebstore.google.com/detail/webnovelsync/gnemgbbfllodlnbioibbgkfkbpblphne?authuser=0&hl=en

## Usage

1. Navigate to any supported source platform with your story
2. Configure target platforms in the extension popup
3. Set chapter range and batch processing options
4. Click "Scan Current Tab" to begin synchronization
5. Monitor progress and retry any failed chapters

## Development Highlights

This project showcases several technical achievements:

- **Cross-Platform Integration**: Successfully integrated with 7 different web platforms, each requiring unique DOM selectors and authentication patterns
- **Asynchronous Processing**: Implemented robust async/await patterns for handling multiple concurrent operations
- **Error Recovery**: Built comprehensive retry mechanisms with exponential backoff for network failures
- **User Interface**: Designed an intuitive popup interface with progressive disclosure and real-time feedback
- **Data Persistence**: Implemented reliable settings storage with automatic sync across browser sessions

## Project Structure

```
webnovelsync-extension/
├── manifest.json              # Extension configuration
├── background.js              # Service worker and core logic
├── popup.html/js/css         # Main user interface
├── *_verification.js         # Platform-specific content scripts
└── icon.png                  # Extension icon
```

## Technical Challenges Solved

- **Platform Diversity**: Each platform has different URL structures, authentication systems, and DOM layouts
- **Rate Limiting**: Implemented intelligent delays to avoid triggering anti-bot measures
- **Data Extraction**: Built robust selectors that work across platform updates
- **State Management**: Coordinated complex state between background script and popup interface
- **Error Handling**: Created comprehensive error recovery for network issues and platform changes

## Contributing

This project is shared for portfolio and educational purposes. While the code is available for viewing, modification and redistribution are restricted under the custom license.

## Contact

For questions or collaboration opportunities, please reach out through GitHub.

## License

This code is provided for viewing purposes only. See LICENSE file for full terms.

---

*This project demonstrates practical application of modern JavaScript, Chrome Extension APIs, and multi-platform integration.*