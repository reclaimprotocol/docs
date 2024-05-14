import React from "react";
import { GenerateProof } from '@reclaimprotocol/reclaim-connect-react';

function GenerateProofUsage () {
  return (
    <GenerateProof
      appID='5910a77a-ebcf-419d-95f0-9f5fa269d741'
      userID='dasq2easdase-asdq2e3'
      onProofSubmission={() => {}}
      onProofSubmissionFailed={() => {}}
    />
  );
}

export default GenerateProofUsage;