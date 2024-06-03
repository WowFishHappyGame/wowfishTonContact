message(0x693d3950) GetRoyaltyParams {
    query_id: Int as uint64;
}

message(0xa8cb00ad) ReportRoyaltyParams {
    query_id: Int as uint64;
    numerator:  Int as uint16;
    denominator: Int as uint16;
    destination: Address;
}


message Mint{
    count: Int as uint32;
    price: Int as uint256;
    nonce: Int as uint64;
    queryId: Int as uint64;
    signature: Slice;
}

message MintControl{
    lastTime: Int as uint32;
    maxCountInTime: Int as uint64;
}


message ChangePublic{
    pub: Int;
}