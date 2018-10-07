pragma solidity ^0.4.24;

contract ElectionConsumer is Chainlinked, Ownable {
  address constant ROPSTEN_LINK_ADDRESS = 0x20fE562d797A42Dcb3399062AE9546cd06f63280;
  address constant ROPSTEN_ORACLE_ADDRESS = 0xB68145133973411b7B3F2726A625FE3f3808240D;

  // TODO: This needs the job spec ID that they created for the GET -> JSON -> BYTES32 job that they created
  bytes32 constant BYTES32_SPEC_ID = bytes32("TODO: ADD SPEC ID");

  event RequestCandidateFulfilled(
    bytes32 indexed requestId,
    bytes32 indexed addr,
    uint16  position,
    uint16  party,
    bytes32 name
  );

  // Persist info about the request so that we can match the name to the proper addr, position, and party
  struct RequestInfo {
      bytes32 addr;
      uint16 position;
      uint16 party;
  }

  // Map IDs to the strings returned by the API as keys
  mapping (uint16 => string) parties;
  mapping (uint16 => string) positions;

  // Address hash -> position ID -> Party ID -> name;
  mapping (bytes32 => mapping (uint16 => mapping (uint16 => bytes))) public info;
  mapping (bytes32 => RequestInfo) public requests;

  constructor() Ownable() public {
    setLinkToken(ROPSTEN_LINK_ADDRESS);
    setOracle(ROPSTEN_ORACLE_ADDRESS);

    // The political parties as keyed by the API
    parties[0] = "DEMOCRATIC";
    parties[1] = "REPUBLICAN";
    parties[2] = "LIBERATARIAN";
    parties[3] = "GREEN";
    parties[4] = "SOCIALIST";

    // The political positions as keyed by the API
    positions[0] = "PRESIDENT";
    positions[1] = "GOVERNOR";
    positions[2] = "SENATOR";
    positions[3] = "REPRESENTATIVE";
    positions[4] = "MAYOR";
  }

  // Called by the client to propagate the name of a candidate for a specified position, and party
  // All saved value are mapped to the hash of the mailing address specified here as _addr
  // The assumtion is that the API takes an argument addr (mailing address) and returns a json blob (decribed below)
  // containing all of the candidates for that address. Because of Chainlink limitations, a request must be made
  // for each name that will be stored.
  function requestCandidate(uint16 _position, uint16 _party, string _addr)
    public
  {
    RequestInfo memory _request = RequestInfo(sha256(bytes(_addr)), _position, _party);

    ChainlinkLib.Run memory run = newRun(BYTES32_SPEC_ID, this, "fulfillCandidate(bytes32,bytes32)");
    requests[run.requestId] = _request;

    // Expected API return value is of the form:
    // {"RACES": {"Position as defined in positions mapping": {"Party as defined in parties mapping": {"NAME": "Candidate Name"}}}}
    // WARNING: We should probably be ensuring that the address is URL encoded before passing it into the API like this.
    //          A POST may be more approriate but would require some crazy custom job spec
    run.add("url", "https://secureware.io/api/myCandidates?addr=" + _addr);             // BROKEN: needs string concat
    run.add("path", "RACES." + positions[_position] + "." + parties[_party] + ".NAME"); // BROKEN: needs string concat
    chainlinkRequest(run, LINK(1));
  }


  function fulfillCandidate(bytes32 _requestId, bytes32 _name)
    public
    checkChainlinkFulfillment(_requestId)
  {
    RequestInfo memory request = requests[_requestId];

    // _name will be the candidates name that has been parsed out of the json blob based on the supplied position and party IDs
    // Write it  into the mapping so that it can be queried directly by the client
    info[request.addr][request.position][request.party] = abi.encodePacked(_name);

    // Client can watch for these events to know when all requested name requests have been fulfilled
    emit RequestCandidateFulfilled(_requestId, request.addr, request.position, request.party, _name);
  }

}
