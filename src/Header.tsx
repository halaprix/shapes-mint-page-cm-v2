import * as anchor from "@project-serum/anchor";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { MintCountdown } from "./MintCountdown";
import { toDate, formatNumber } from "./utils";
import { CandyMachineAccount } from "./candy-machine";

type HeaderProps = {
  candyMachine?: CandyMachineAccount;
};

export const Header = ({
  candyMachine,
  refreshCandyMachineState,
}: {
  candyMachine?: CandyMachineAccount;
  refreshCandyMachineState: any;
}) => {
  return (
    <Grid container direction="row" justifyContent="center" wrap="nowrap">
      <Grid container direction="row" wrap="nowrap">
        {candyMachine && (
          <Grid container direction="row" wrap="nowrap">
            <Grid container direction="column">
              <Typography variant="body2" style={{ color: "#614014" }}>
                Remaining
              </Typography>
              <Typography
                variant="h6"
                style={{
                  fontWeight: "bold",
                  color: "#614014",
                }}
              >
                {`${candyMachine?.state.itemsRemaining}`}
              </Typography>
            </Grid>
            <Grid container direction="column">
              <Typography variant="body2" style={{ color: "#614014" }}>
                Price
              </Typography>
              <Typography
                variant="h6"
                style={{ fontWeight: "bold", color: "#614014" }}
              >
                {getMintPrice(candyMachine)}
              </Typography>
            </Grid>
          </Grid>
        )}
        <MintCountdown
          date={toDate(
            candyMachine?.state.goLiveDate
              ? candyMachine?.state.goLiveDate
              : candyMachine?.state.isPresale
              ? new anchor.BN(new Date().getTime() / 1000)
              : undefined
          )}
          style={{ justifyContent: "flex-end" }}
          status={
            !candyMachine?.state?.isActive || candyMachine?.state?.isSoldOut
              ? "COMPLETED"
              : candyMachine?.state.isPresale
              ? "PRESALE"
              : "LIVE"
          }
          refreshCandyMachineState={refreshCandyMachineState}
        />
      </Grid>
    </Grid>
  );
};

const getMintPrice = (candyMachine: CandyMachineAccount): string => {
  const price = formatNumber.asNumber(
    candyMachine.state.isPresale &&
      candyMachine.state.whitelistMintSettings?.discountPrice
      ? candyMachine.state.whitelistMintSettings?.discountPrice!
      : candyMachine.state.price!
  );
  return `◎ ${price}`;
};
