import { useEffect, useMemo, useState, useCallback } from "react";
import * as anchor from "@project-serum/anchor";

import styled from "styled-components";
import { Container, Snackbar, CircularProgress, Box } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Alert from "@material-ui/lab/Alert";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";
import {
  awaitTransactionSignatureConfirmation,
  CandyMachineAccount,
  CANDY_MACHINE_PROGRAM,
  getCandyMachineState,
  mintOneToken,
} from "./candy-machine";
import { AlertState } from "./utils";
import { checkWLToken } from "./utils/checkWLToken";
import { Header } from "./Header";
import { MintButton } from "./MintButton";
import { GatewayProvider } from "@civic/solana-gateway-react";
import { usePoller } from "./hooks/usePoller";
//@ts-ignore
import confetti from "canvas-confetti";
require("./Bg.css");
const IMAGE_LINK = "/animation.gif";
const LOGO_LINK = "/logo.png";

function throwConfetti(): void {
  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.6 },
  });
}

const ConnectButton = styled(WalletDialogButton)`
  width: 100%;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 5px;
  background: linear-gradient(29deg, #fe4a49 0%, #aeeeb2 100%);
  color: #614014;
  font-size: 16px;
  font-weight: bold;
`;

const StyledPaper = styled(Paper)`
  padding: 20px;
  background-color: #eed2ae;
  border-radius: 6px;
  margin: 10px;
  -webkit-box-shadow: 8px 8px 71px 0px rgba(83, 66, 90, 1);
  -moz-box-shadow: 8px 8px 71px 0px rgba(83, 66, 90, 1);
  box-shadow: 8px 8px 71px 0px rgba(83, 66, 90, 1);
`;
const MintContainer = styled.div``; // add your owns styles here

export interface HomeProps {
  candyMachineId?: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  txTimeout: number;
  rpcHost: string;
}

const Home = (props: HomeProps) => {
  const [animatedBg, setAnimatedBg] = useState(false);
  const [isUserMinting, setIsUserMinting] = useState(false);
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
  const [userHasWhitelistToken, setUserHasWhitelistToken] = useState(false);
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [loading, setLoading] = useState(true);
  const rpcUrl = props.rpcHost;
  const wallet = useWallet();

  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as anchor.Wallet;
  }, [wallet]);

  const refreshCandyMachineState = useCallback(async () => {
    if (!anchorWallet) {
      return;
    }

    if (props.candyMachineId) {
      try {
        const cndy = await getCandyMachineState(
          anchorWallet,
          props.candyMachineId,
          props.connection
        );
        setCandyMachine(cndy);
        let WLToken = await checkWLToken(
          props.connection,
          anchorWallet.publicKey,
          cndy?.state?.whitelistMintSettings?.mint
        );
        WLToken
          ? setUserHasWhitelistToken(true)
          : setUserHasWhitelistToken(false);
        setLoading(false);
      } catch (e) {
        console.log("There was a problem fetching Candy Machine state");
        console.log(e);
      }
    }
  }, [anchorWallet, props.candyMachineId, props.connection]);
  var pollTime;
  usePoller(
    () => {
      refreshCandyMachineState();
    },
    pollTime ? pollTime : 9999
  );
  const onMint = async () => {
    try {
      setIsUserMinting(true);
      document.getElementById("#identity")?.click();
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        const mintTxId = (
          await mintOneToken(candyMachine, wallet.publicKey)
        )[0];

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            props.txTimeout,
            props.connection,
            true
          );
        }

        if (status && !status.err) {
          throwConfetti();
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (!error.message) {
          message = "Transaction Timeout! Please try again.";
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          window.location.reload();
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setIsUserMinting(false);
    }
  };

  useEffect(() => {
    refreshCandyMachineState();
  }, [
    anchorWallet,
    props.candyMachineId,
    props.connection,
    refreshCandyMachineState,
  ]);

  return (
    <>
      {animatedBg && <div className="section section--featured">
        <div className="row-container">
          <div className="line">
            <div>
              <div className="row">
                <img src="line-3-min.png" alt="" />
              </div>
              <div className="row">
                <img src="line-3-min.png" alt="" />
              </div>
            </div>
          </div>

          <div className="line second">
            <div>
              <div className="row">
                <img src="line-1-min.png" alt="" />
              </div>
              <div className="row">
                <img src="line-1-min.png" alt="" />
              </div>
            </div>
          </div>
          <div className="line third">
            <div>
              <div className="row">
                <img src="line-3-min.png" alt="" />
              </div>
              <div className="row">
                <img src="line-3-min.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="shadow">
          <span></span>
        </div>
      </div>}
      <Box style={{ minHeight: "100vh", display: "flex" }} alignItems="center">
        <Container maxWidth="xs" style={{ position: "relative" }}>
          <StyledPaper>
            {" "}
            <img
              src={LOGO_LINK}
              alt=""
              width="100%"
              style={{ borderRadius: "5px" }}
              onClick={()=> setAnimatedBg(!animatedBg)}
            />
          </StyledPaper>
          <StyledPaper>
            <div>
              <img
                src={IMAGE_LINK}
                alt=""
                width="100%"
                style={{ borderRadius: "5px" }}
              />
            </div>
          </StyledPaper>

          <StyledPaper>
            {!wallet.connected ? (
              <ConnectButton>Connect Wallet</ConnectButton>
            ) : loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <CircularProgress />
              </div>
            ) : (
              <>
                <Header
                  candyMachine={candyMachine}
                  refreshCandyMachineState={refreshCandyMachineState}
                />
                <MintContainer>
                  {candyMachine?.state.isActive &&
                  candyMachine?.state.gatekeeper &&
                  wallet.publicKey &&
                  wallet.signTransaction ? (
                    <GatewayProvider
                      wallet={{
                        publicKey:
                          wallet.publicKey ||
                          new PublicKey(CANDY_MACHINE_PROGRAM),
                        //@ts-ignore
                        signTransaction: wallet.signTransaction,
                      }}
                      gatekeeperNetwork={
                        candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                      }
                      clusterUrl={rpcUrl}
                      options={{ autoShowModal: false }}
                    >
                      <MintButton
                        candyMachine={candyMachine}
                        isMinting={isUserMinting}
                        onMint={onMint}
                        userHasWhitelistToken={userHasWhitelistToken}
                      />
                    </GatewayProvider>
                  ) : (
                    <MintButton
                      candyMachine={candyMachine}
                      isMinting={isUserMinting}
                      onMint={onMint}
                      userHasWhitelistToken={userHasWhitelistToken}
                    />
                  )}
                </MintContainer>
              </>
            )}
          </StyledPaper>
        </Container>

        <Snackbar
          open={alertState.open}
          autoHideDuration={6000}
          onClose={() => setAlertState({ ...alertState, open: false })}
        >
          <Alert
            onClose={() => setAlertState({ ...alertState, open: false })}
            severity={alertState.severity}
          >
            {alertState.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default Home;
