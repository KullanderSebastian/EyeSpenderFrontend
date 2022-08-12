import React from "react";

const ProfilePlaceholder = props => (
    <svg width="100" height="100">
        <circle cx="50" cy="50" r="50" fill="#2ecc71" />
        <text x="50%" y="50%" alignment-baseline="central" text-anchor="middle" font-family="sans-serif" font-size="50" fill="#fff">{props.letter}</text>
    </svg>
)

export default ProfilePlaceholder;
