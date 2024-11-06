module.exports = {
  releaseCommitMessageFormat:
    "chore(release): :bookmark: update to version {{currentTag}}",
  skip: {
    bump: true,
    commit: true,
    push: true,
    tag: true,
  },
  types: [
    { type: "feat", section: ":sparkles: New Features" },
    { type: "fix", section: ":bug: Bug Fixes" },
    { type: "chore", section: ":art: Chores" },
    { type: "docs", section: ":memo: Documentation Updates" },
    { type: "style", section: ":lipstick: Component UI Updates" },
    { type: "refactor", section: ":recycle: Refactors" },
    { type: "perf", section: ":zap: Performance Improvements" },
    { type: "test", section: ":white_check_mark: Test Result Updates" },
    { type: "revert", section: ":rewind: Revert Changes" },
  ],
};
