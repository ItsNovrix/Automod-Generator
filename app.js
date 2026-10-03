// 1. DOM Elements
const form = document.getElementById('automod-form');
const yamlOutput = document.getElementById('yaml-output');
const copyBtn = document.getElementById('copy-btn');

// Pinned Comments Elements
const pinnedToggle = document.getElementById('pinned-comment-toggle');
const pinnedSettings = document.getElementById('pinned-comment-settings');
const pinnedText = document.getElementById('pinned-comment-text');
const pinnedLock = document.getElementById('pinned-comment-lock');

// User Age Elements
const ageToggle = document.getElementById('age-filter-toggle');
const ageSettings = document.getElementById('age-filter-settings');
const ageDays = document.getElementById('age-days');
const ageTarget = document.getElementById('age-target');
const ageAction = document.getElementById('age-action');

// User Karma Elements
const karmaToggle = document.getElementById('karma-filter-toggle');
const karmaSettings = document.getElementById('karma-filter-settings');
const karmaType = document.getElementById('karma-type');
const karmaTarget = document.getElementById('karma-target');
const karmaAmount = document.getElementById('karma-amount');
const karmaAction = document.getElementById('karma-action');

// ALL CAPS Filter Elements
const allCapsToggle = document.getElementById('all-caps-toggle');
const allCapsSettings = document.getElementById('all-caps-settings');
const capsTitle = document.getElementById('caps-title');
const capsBody = document.getElementById('caps-body');
const capsComment = document.getElementById('caps-comment');
const allCapsAction = document.getElementById('all-caps-action');

// Edited Content Filter Elements
const editedFilterToggle = document.getElementById('edited-filter-toggle');
const editedFilterSettings = document.getElementById('edited-filter-settings');
const editedPost = document.getElementById('edited-post');
const editedComment = document.getElementById('edited-comment');
const editedAction = document.getElementById('edited-action');

// Mass Edit Filter Elements
const massEditToggle = document.getElementById('mass-edit-toggle');
const massEditSettings = document.getElementById('mass-edit-settings');
const massEditPost = document.getElementById('mass-edit-post');
const massEditComment = document.getElementById('mass-edit-comment');
const massEditAction = document.getElementById('mass-edit-action');

// Crowdfunding Filter
const crowdfundToggle = document.getElementById('crowdfund-toggle');
const crowdfundSettings = document.getElementById('crowdfund-settings');
const crowdfundPost = document.getElementById('crowdfund-post');
const crowdfundComment = document.getElementById('crowdfund-comment');
const crowdfundAction = document.getElementById('crowdfund-action');

// Political Terms Filter
const politicalFilterToggle = document.getElementById('political-filter-toggle');
const politicalFilterSettings = document.getElementById('political-filter-settings');
const politicalPost = document.getElementById('political-post');
const politicalComment = document.getElementById('political-comment');
const politicalAction = document.getElementById('political-action');

// Auto-Reply Elements
const autoReplyToggle = document.getElementById('auto-reply-toggle');
const autoReplySettings = document.getElementById('auto-reply-settings');
const autoReplyTarget = document.getElementById('auto-reply-target');
const autoReplyMessage = document.getElementById('auto-reply-message');
const autoReplyLock = document.getElementById('auto-reply-lock');
const autoReplyTagContainer = document.getElementById('auto-reply-tag-container');
const autoReplyKeywordInput = document.getElementById('auto-reply-keyword-input');
let autoReplyKeywordsArray = [];

// 2. UI Toggle Logic
function updateUI() {
    
    // Pinned Comment
    if (pinnedToggle.checked) {
        pinnedSettings.classList.add('visible');
    } else {
        pinnedSettings.classList.remove('visible');
    }

    // Account Age
    if (ageToggle.checked) {
        ageSettings.classList.add('visible');
    } else {
        ageSettings.classList.remove('visible');
    }

    // Karma Filter
    if (karmaToggle.checked) {
        karmaSettings.classList.add('visible');
    } else {
        karmaSettings.classList.remove('visible');
    }

    // ALL CAPS Filter
    if (allCapsToggle.checked) {
        allCapsSettings.classList.add('visible');
    } else {
        allCapsSettings.classList.remove('visible');
    }

    // CEdited Content Filter
    if (editedFilterToggle.checked) {
        editedFilterSettings.classList.add('visible');
    } else {
        editedFilterSettings.classList.remove('visible');
    }

    // Mass Edit Filter
    if (massEditToggle.checked) {
        massEditSettings.classList.add('visible');
    } else {
        massEditSettings.classList.remove('visible');
    }

    // Crowdfunding Filter
    if (crowdfundToggle.checked) {
        crowdfundSettings.classList.add('visible');
    } else {
        crowdfundSettings.classList.remove('visible');
    }

    // Political Terms Filter
    if (politicalFilterToggle.checked) {
        politicalFilterSettings.classList.add('visible');
    } else {
        politicalFilterSettings.classList.remove('visible');
    }

    // Auto-Reply
    if (autoReplyToggle.checked) {
        autoReplySettings.classList.add('visible');
    } else {
        autoReplySettings.classList.remove('visible');
    }
}

// --- TAG INPUT ENGINE ---
function renderTags() {
    const existingTags = autoReplyTagContainer.querySelectorAll('.tag-bubble');
    existingTags.forEach(tag => tag.remove());

    autoReplyKeywordsArray.forEach((keyword, index) => {
        const tag = document.createElement('span');
        tag.classList.add('tag-bubble');
        tag.innerHTML = `${keyword} <span class="tag-close" data-index="${index}">&times;</span>`;
        autoReplyTagContainer.insertBefore(tag, autoReplyKeywordInput);
    });

    updateUI();
    generateYAML();
}

autoReplyTagContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('tag-close')) {
        const indexToRemove = e.target.getAttribute('data-index');
        autoReplyKeywordsArray.splice(indexToRemove, 1);
        renderTags();
    }
});

autoReplyKeywordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const rawWord = autoReplyKeywordInput.value.trim();
        if (rawWord !== '' && !autoReplyKeywordsArray.includes(rawWord)) {
            autoReplyKeywordsArray.push(rawWord);
            autoReplyKeywordInput.value = '';
            renderTags();
        } else {
            autoReplyKeywordInput.value = '';
        }
    }
});

// 3. YAML Compiler
function generateYAML() {
    let yaml = `# Generated by AutoMod Generator\n---\n`;
    let hasRules = false;

    // Rule: Pinned Welcome Comment
    if (pinnedToggle.checked && pinnedText.value.trim() !== "") {
        hasRules = true;
        yaml += `type: submission\n`;
        
        const indentedComment = pinnedText.value.split('\n').map(line => `    ${line}`).join('\n');
        yaml += `comment: |\n${indentedComment}\n`;
        yaml += `comment_stickied: true\n`;
        
        if (pinnedLock.checked) {
            yaml += `comment_locked: true\n`;
        }
        
        yaml += `---\n`;
    }

    // Rule: Account Age Filter
    if (ageToggle.checked && ageDays.value > 0) {
        hasRules = true;
        yaml += `type: ${ageTarget.value}\n`; // UPDATED
        yaml += `author:\n`;
        yaml += `    account_age: "< ${ageDays.value} days"\n`;
        yaml += `    is_moderator: false\n`; 
        yaml += `action: ${ageAction.value}\n`;
        yaml += `action_reason: "Account is younger than ${ageDays.value} days"\n`;
        yaml += `---\n`;
    }

    // Rule: Low Karma Filter
    if (karmaToggle.checked && karmaAmount.value !== "") {
        hasRules = true;
        yaml += `type: ${karmaTarget.value}\n`; // UPDATED
        yaml += `author:\n`;
        yaml += `    ${karmaType.value}: "< ${karmaAmount.value}"\n`;
        yaml += `    is_moderator: false\n`;
        yaml += `action: ${karmaAction.value}\n`;
        
        const readableKarmaType = karmaType.options[karmaType.selectedIndex].text;
        yaml += `action_reason: "User has less than ${karmaAmount.value} ${readableKarmaType}"\n`;
        yaml += `---\n`;
    }

    // Rule: Remove ALL CAPS Content
    if (allCapsToggle.checked) {
        
        const capsRegex = "'[^a-z]*[A-Z][^a-z]*'";
        
        if (capsTitle.checked) {
            hasRules = true;
            yaml += `type: submission\n`;
            yaml += `title (regex, full-exact): ${capsRegex}\n`;
            yaml += `action: ${allCapsAction.value}\n`;
            yaml += `action_reason: "ALL CAPS Title"\n`;
            yaml += `---\n`;
        }
        
        if (capsBody.checked) {
            hasRules = true;
            yaml += `type: submission\n`;
            yaml += `body (regex, full-exact): ${capsRegex}\n`;
            yaml += `action: ${allCapsAction.value}\n`;
            yaml += `action_reason: "ALL CAPS Post Body"\n`;
            yaml += `---\n`;
        }
        
        if (capsComment.checked) {
            hasRules = true;
            yaml += `type: comment\n`;
            yaml += `body (regex, full-exact): ${capsRegex}\n`;
            yaml += `action: ${allCapsAction.value}\n`;
            yaml += `action_reason: "ALL CAPS Comment"\n`;
            yaml += `---\n`;
        }
    }

    // Rule: Remove Edited Content
    if (editedFilterToggle.checked) {
        if (editedPost.checked) {
            hasRules = true;
            yaml += `type: submission\n`;
            yaml += `is_edited: true\n`;
            yaml += `action: ${editedAction.value}\n`;
            yaml += `action_reason: "Edited Post"\n`;
            yaml += `---\n`;
        }
        
        if (editedComment.checked) {
            hasRules = true;
            yaml += `type: comment\n`;
            yaml += `is_edited: true\n`;
            yaml += `action: ${editedAction.value}\n`;
            yaml += `action_reason: "Edited Comment"\n`;
            yaml += `---\n`;
        }
    }

    // Rule: Mass Edited Content
    if (massEditToggle.checked) {
        const massEditKeywords = `['redact.dev', 'codepen.io/j0be', 'github.com/j0be', 'codepen.io/pkolyvas', 'the-federation.info', 'Power Delete Suite', 'edited and anonymized', 'edited in protest']`;
        
        if (massEditPost.checked) {
            hasRules = true;
            yaml += `type: submission\n`;
            yaml += `body+url (includes): ${massEditKeywords}\n`;
            yaml += `is_edited: true\n`;
            yaml += `action: ${massEditAction.value}\n`;
            yaml += `action_reason: "Mass Edited Post"\n`;
            yaml += `---\n`;
        }
        
        if (massEditComment.checked) {
            hasRules = true;
            yaml += `type: comment\n`;
            yaml += `body+url (includes): ${massEditKeywords}\n`;
            yaml += `is_edited: true\n`;
            yaml += `action: ${massEditAction.value}\n`;
            yaml += `action_reason: "Mass Edited Comment"\n`;
            yaml += `---\n`;
        }
    }

    // Rule: Crowdfunding Filter
    if (crowdfundToggle.checked) {
        const crowdfundKeywords = `['begslist.com', 'booster.com', 'cash.app', 'cash.me', 'charityvest.org', 'crowdfunder.co.uk', 'crowdrise.com', 'donorschoose.org', 'firstgiving.com', 'fnd.us', 'fundanything.com', 'fundly.com', 'fundrazr.com', 'generosity.com', 'gf.me', 'gfwd.at', 'givealittle.co.nz', 'giveforward.com', 'givesendgo.com', 'gofund.me', 'gofundme.com', 'goget.fund', 'gogetfunding.com', 'igg.me', 'indiegogo.com', 'justgiving.com', 'kck.st', 'ketto.org', 'kickbooster.me', 'kckb.st', 'kickstarter.com', 'launchfinance.com.au', 'm-lp.co', 'patreon.com', 'payfriendz.me', 'payit2.com', 'payitsquare.com', 'paypal.com/cgi-bin', 'paypal.com/paypalme', 'paypal.me', 'petcaring.com', 'pitchfuse.com', 'redditmade.com', 'sponsorchange.org', 'tilt.com', 'tilt.tc', 'totalgiving.co.uk', 'youcaring.com', 'youcaring.net', 'youcaring.org']`;
        
        if (crowdfundPost.checked) {
            hasRules = true;
            yaml += `type: submission\n`;
            yaml += `title+body+url (includes): ${crowdfundKeywords}\n`;
            yaml += `action: ${crowdfundAction.value}\n`;
            yaml += `action_reason: "Crowdfunding/Payment Link in Post"\n`;
            yaml += `---\n`;
        }
        
        if (crowdfundComment.checked) {
            hasRules = true;
            yaml += `type: comment\n`;
            yaml += `body (includes): ${crowdfundKeywords}\n`;
            yaml += `action: ${crowdfundAction.value}\n`;
            yaml += `action_reason: "Crowdfunding/Payment Link in Comment"\n`;
            yaml += `---\n`;
        }
    }

    // Rule: Political Terms Filter
    if (politicalFilterToggle.checked) {
        const politicalKeywords = `['dei', 'trump', 'donald', 'biden', 'liberal', 'nazi', 'luigi', 'tesla', 'elon', 'musk', 'charlie kirk', 'kirk', 'tpusa', 'turning point', 'turning point usa', 'libtard', 'tds', 'magats?', 'maggats?', 'liberal\\\\W?morons?', 'sjw', 'snow\\\\W?flakes?']`;
        
        if (politicalPost.checked) {
            hasRules = true;
            yaml += `type: submission\n`;
            yaml += `title+body (regex, includes-word): ${politicalKeywords}\n`;
            yaml += `action: ${politicalAction.value}\n`;
            yaml += `action_reason: "Political terminology"\n`;
            yaml += `---\n`;
        }
        
        if (politicalComment.checked) {
            hasRules = true;
            yaml += `type: comment\n`;
            yaml += `body (regex, includes-word): ${politicalKeywords}\n`;
            yaml += `action: ${politicalAction.value}\n`;
            yaml += `action_reason: "Political terminology"\n`;
            yaml += `---\n`;
        }
    }

    // Rule: Auto-Reply by Keyword
    if (autoReplyToggle.checked && autoReplyKeywordsArray.length > 0 && autoReplyMessage.value.trim() !== "") {
        hasRules = true;
        
        const formattedArray = autoReplyKeywordsArray.map(k => `"${k}"`).join(', ');
        yaml += `type: ${autoReplyTarget.value}\n`;
        yaml += `title+body (includes): [${formattedArray}]\n`;
        
        const indentedReply = autoReplyMessage.value.split('\n').map(line => `    ${line}`).join('\n');
        yaml += `comment: |\n${indentedReply}\n`;
        
        if (autoReplyLock.checked) {
            yaml += `comment_locked: true\n`;
        }
        yaml += `---\n`;
    }

    if (!hasRules) {
        yaml = `# Select a rule on the left to generate code...`;
    }

    yamlOutput.textContent = yaml;
}

// 4. Event Listeners
 form.addEventListener('input', () => {

    updateUI();

    generateYAML();

});

copyBtn.addEventListener('click', () => {
    const textToCopy = yamlOutput.textContent;
    if (textToCopy === `# Select a rule on the left to generate code...`) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.backgroundColor = '#28a745';

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = 'var(--primary)';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
});
