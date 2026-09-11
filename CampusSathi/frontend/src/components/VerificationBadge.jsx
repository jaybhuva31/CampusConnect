import React from 'react';

const VerificationBadge = ({ status, lastVerified, sourceName, sourceUrl }) => {
  // Public UI policy: Do NOT display "Verified" or "Information not verified yet" badges to public users.
  // Internal admin tracking fields remain intact in database models.
  return null;
};

export default VerificationBadge;
