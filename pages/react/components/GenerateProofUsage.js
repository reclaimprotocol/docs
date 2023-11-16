import React from "react";
import { GenerateProof } from '@reclaimprotocol/reclaim-connect-react';

function GenerateProofUsage () {
  return (
    <GenerateProof
      appID='6d6c04eb-237b-4599-8797-94d48b0ac612'
      userID='dasq2easdase-asdq2e3'
      onProofSubmission={() => {}}
      onProofSubmissionFailed={() => {}}
    />
  );
}

export default GenerateProofUsage;