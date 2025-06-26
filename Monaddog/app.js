
    import { sdk } from 'https://esm.sh/@farcaster/frame-sdk';
    
    // Mini App ready when loaded
    window.addEventListener('load', async () => {
      try {
        await sdk.actions.ready();
        console.log('Farcaster Mini App ready!');
        
        // Make SDK available globally
        window.farcasterSDK = sdk;
      } catch (error) {
        console.log('Not running in Farcaster client:', error);
      }
    });
  


    // Wait for Supabase to load
    window.addEventListener('DOMContentLoaded', function() {
      // Supabase Configuration
      const SUPABASE_URL = 'https://uhqszfoekqrjtybrwqzt.supabase.co';
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVocXN6Zm9la3FyanR5YnJ3cXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MDMxNTAsImV4cCI6MjA2NjM3OTE1MH0.gGch8B6AlvGrZTDVjfd0xidVnh_Dsua4qRxbaixBqM0';
      
      // Initialize Supabase
      let supabaseClient;
      if (window.supabase) {
        const { createClient } = window.supabase;
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase initialized');
      } else {
        console.error('❌ Supabase not loaded');
      }
    
          // Initialize modal close functions globally
      window.closeAchievementModal = function() {
        const modal = document.getElementById('achievementModal');
        if (modal) {
          modal.style.display = 'none';
        }
        window.currentAchievement = null;
        
        // Remove escape key listener
        if (window.achievementEscapeHandler) {
          document.removeEventListener('keydown', window.achievementEscapeHandler);
        }
        
        console.log('Modal closed');
      }
      
      window.shareCurrentAchievement = function() {
        if (window.currentAchievement) {
          try {
            const content = generateShareableContent(window.currentAchievement.type, window.currentAchievement.data);
            shareOnFarcaster(content);
            
            // Close modal after sharing
            setTimeout(() => {
              closeAchievementModal();
            }, 500);
          } catch (error) {
            console.error('Error sharing achievement:', error);
            closeAchievementModal();
          }
        }
      }
      
      console.log('🚀 Starting app...');
    
    // Enhanced Loading Management
    let loadingProgress = 0;
    let isAppReady = false;
    let activeTab = 'pet';

    function updateLoadingProgress(progress, message) {
      const progressBar = document.getElementById('loadingProgressBar');
      const subtitle = document.querySelector('.loading-subtitle');
      
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
      
      if (subtitle && message) {
        subtitle.innerHTML = message;
      }
      
      loadingProgress = progress;
      console.log(`📊 Loading progress: ${progress}% - ${message}`);
    }

    function showLoadingState() {
      document.getElementById('loading').style.display = 'flex';
      document.querySelector('.app-content').classList.remove('loaded');
      updateLoadingProgress(0, 'Starting Monad Dog...<br>🚀 Initializing blockchain connection');
    }

    function hideLoadingState() {
      // Don't hide immediately - show completion
      updateLoadingProgress(100, 'Ready to play! 🎉<br>Welcome to Monad Dog!');
      
      setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        document.querySelector('.app-content').classList.add('loaded');
        isAppReady = true;
        
        // Call Farcaster ready action
        if (sdk && sdk.actions && sdk.actions.ready) {
          sdk.actions.ready({
            disableNativeGestures: false // Allow native gestures for better UX
          }).then(() => {
            console.log('✅ Farcaster SDK ready called successfully');
          }).catch(error => {
            console.log('⚠️ Farcaster SDK ready failed:', error);
          });
        }
        
        console.log('🎉 App fully loaded and ready');
      }, 500);
    }

    // Simulate progressive loading with actual initialization steps
    async function initializeAppWithProgress() {
      try {
        showLoadingState();
        
        // Step 1: Initialize SDK
        updateLoadingProgress(20, 'Loading Farcaster SDK...<br>🔗 Connecting to Frame environment');
        
        try {
          const module = await import('https://esm.sh/@farcaster/frame-sdk');
          sdk = module.sdk;
          console.log('SDK loaded:', !!sdk);
          
          if (sdk) {
            updateLoadingProgress(40, 'Farcaster SDK loaded! ✅<br>📱 Setting up Mini App environment');
            await sdk.actions.ready();
            console.log('SDK ready');
          }
        } catch (e) {
          console.log('SDK not available:', e.message);
          updateLoadingProgress(40, 'Running in standalone mode<br>🌐 Browser environment detected');
        }

        // Step 2: Setup game functions
        updateLoadingProgress(60, 'Setting up game functions...<br>🎮 Preparing blockchain interactions');
        await new Promise(resolve => setTimeout(resolve, 300)); // Small delay for UX
        
        setupEventListeners();
        setupGameFunctions();
        
        // Step 3: Initialize app
        updateLoadingProgress(80, 'Initializing app...<br>🎮 Setting up game');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Step 4: Finalize
        updateLoadingProgress(95, 'Almost ready...<br>✨ Final preparations');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        hideLoadingState();
        console.log('✅ App initialized successfully with progress tracking');
        
      } catch (error) {
        console.error('❌ Init error:', error);
        updateLoadingProgress(100, 'Error occurred, but app will continue<br>⚠️ Some features may be limited');
        
        setTimeout(() => {
          hideLoadingState();
        }, 1000);
      }
    }

    // Enhanced error handling for better loading experience
    function handleLoadingError(error, step) {
      console.error(`❌ Loading error at step "${step}":`, error);
      
      const errorMessages = {
        sdk: 'SDK loading failed<br>🌐 Continuing in browser mode',
        functions: 'Function setup error<br>⚠️ Some features may be limited',
        leaderboard: 'Leaderboard loading failed<br>📊 Will retry automatically',
        general: 'Loading error occurred<br>🔄 Attempting to continue'
      };
      
      const message = errorMessages[step] || errorMessages.general;
      updateLoadingProgress(loadingProgress, message);
      
      // Continue loading after brief delay
      setTimeout(() => {
        if (loadingProgress < 100) {
          hideLoadingState();
        }
      }, 1500);
    }

    // Skeleton loading for leaderboard while data loads
    function showLeaderboardSkeleton() {
      const tbody = document.getElementById('leaderboardBody');
      if (!tbody) return;
      
      const skeletonRows = Array.from({length: 5}, (_, i) => `
        <tr>
          <td class="rank-number skeleton skeleton-text" style="width: 30px;"></td>
          <td class="address-cell">
            <div class="skeleton skeleton-text" style="width: 120px;"></div>
            <div class="skeleton skeleton-text" style="width: 80px; margin-top: 4px;"></div>
          </td>
          <td class="tx-count skeleton skeleton-text" style="width: 40px;"></td>
        </tr>
      `).join('');
      
      tbody.innerHTML = skeletonRows;
    }

    // Preload critical resources
    function preloadResources() {
      // Preload dog images for faster switching
      const dogImages = [1, 7, 12, 15, 23, 28, 34, 42, 47, 53];
      dogImages.forEach(id => {
        const img = new Image();
        img.src = `https://placedog.net/400/300?id=${id}`;
      });
      
      console.log('🖼️ Preloaded dog images for better performance');
    }

    // Contract addresses and ABIs
    const CONTRACTS = {
      PET: "0xc53abe4c593b9440407f8ac1b346f3f999e6d8ed",
      GREET: "0xbc8b78f3e2348d4b5e0390fe700ce54b59931da4",
      FLIP: "0xc5b2280d1e2f155f9a2be2af7e78190658874106",
      DOG_TOKEN: "0x1f6649d028c4c146c050a9b224115a01c92a02f3" // Your deployed DOG token contract
    };

    const ABIS = {
      PET: ["function pet() public"],
      GREET: ["function gm() public", "function gn() public"],
      FLIP: ["function flip() public"],
      DOG_TOKEN: [
        "function claim(uint256 xpAmount) public",
        "function balanceOf(address account) public view returns (uint256)",
        "function decimals() public view returns (uint8)",
        "function symbol() public view returns (string)",
        "function totalSupply() public view returns (uint256)",
        "function getClaimedXP(address user) public view returns (uint256)",
        "function totalMinted() public view returns (uint256)",
        "event TokensClaimed(address indexed user, uint256 xpAmount, uint256 tokenAmount)"
      ]
    };

    // XP to DOG token conversion rate
    const XP_TO_DOG_RATE = 10; // 10 XP = 1 DOG token

    // Track claimed XP to prevent double-spending
    let claimedXP = {};

    // Supabase Functions for XP Management - with error handling and fallback
    async function getWalletXP(address) {
      if (!address) return 0;
      
      try {
        // Check if Supabase is available
        if (!supabaseClient) {
          console.log('Supabase not available, using localStorage fallback');
          return parseInt(localStorage.getItem(`wallet_xp_${address.toLowerCase()}`) || '0');
        }

        const { data, error } = await supabaseClient
          .from('user_xp')
          .select('xp')
          .eq('wallet_address', address.toLowerCase())
          .single();
        
        if (error) {
          console.log('No XP record found, returning 0');
          // Fallback to localStorage
          return parseInt(localStorage.getItem(`wallet_xp_${address.toLowerCase()}`) || '0');
        }
        
        return data.xp || 0;
      } catch (e) {
        console.error('Error fetching XP:', e);
        // Fallback to localStorage
        return parseInt(localStorage.getItem(`wallet_xp_${address.toLowerCase()}`) || '0');
      }
    }

    async function saveWalletXP(address, xp) {
      if (!address) return;
      
      // Always save to localStorage first (immediate)
      localStorage.setItem(`wallet_xp_${address.toLowerCase()}`, xp.toString());
      
      // Then try Supabase (async, non-blocking)
      if (supabaseClient) {
        supabaseClient
          .from('user_xp')
          .upsert({
            wallet_address: address.toLowerCase(),
            xp: xp,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'wallet_address'
          })
          .then(({ error }) => {
            if (!error) {
              console.log(`💾 XP saved to Supabase for ${address}: ${xp}`);
            }
          })
          .catch(e => {
            console.error('Error saving XP to Supabase:', e);
          });
      }
    }

    // Get claimed XP amount to prevent double-spending
    async function getClaimedXPAmount(address) {
      if (!address) return 0;
      
      try {
        // First check local cache
        if (claimedXP[address.toLowerCase()]) {
          return claimedXP[address.toLowerCase()];
        }
        
        // Try to get from contract (most reliable)
        if (appState.provider) {
          try {
            const dogTokenContract = new ethers.Contract(
              CONTRACTS.DOG_TOKEN,
              ["function getClaimedXP(address user) public view returns (uint256)"],
              appState.provider
            );
            
            const claimed = await dogTokenContract.getClaimedXP(address);
            const claimedAmount = claimed.toNumber();
            
            // Cache the result
            claimedXP[address.toLowerCase()] = claimedAmount;
            
            return claimedAmount;
          } catch (e) {
            console.log('Could not fetch claimed XP from contract:', e);
          }
        }
        
        // Fallback to Supabase
        if (supabaseClient) {
          const { data, error } = await supabaseClient
            .from('claimed_xp')
            .select('total_claimed')
            .eq('wallet_address', address.toLowerCase())
            .single();
          
          if (!error && data) {
            claimedXP[address.toLowerCase()] = data.total_claimed || 0;
            return data.total_claimed || 0;
          }
        }
        
        // Final fallback to localStorage
        const localClaimed = parseInt(localStorage.getItem(`claimed_xp_${address.toLowerCase()}`) || '0');
        claimedXP[address.toLowerCase()] = localClaimed;
        return localClaimed;
        
      } catch (e) {
        console.error('Error getting claimed XP:', e);
        return 0;
      }
    }

    // Save claimed XP to prevent double-spending
    async function saveClaimedXP(address, amount) {
      if (!address) return;
      
      const totalClaimed = (claimedXP[address.toLowerCase()] || 0) + amount;
      claimedXP[address.toLowerCase()] = totalClaimed;
      
      // Save to localStorage immediately
      localStorage.setItem(`claimed_xp_${address.toLowerCase()}`, totalClaimed.toString());
      
      // Save to Supabase (non-blocking)
      if (supabaseClient) {
        supabaseClient
          .from('claimed_xp')
          .upsert({
            wallet_address: address.toLowerCase(),
            total_claimed: totalClaimed,
            last_claim: new Date().toISOString()
          }, {
            onConflict: 'wallet_address'
          })
          .then(({ error }) => {
            if (!error) {
              console.log(`💾 Claimed XP saved: ${totalClaimed} for ${address}`);
            }
          })
          .catch(e => {
            console.error('Error saving claimed XP:', e);
          });
      }
    }

    // Token claim history management with Supabase - optimized
    async function getClaimHistory(address) {
      if (!address) return [];
      
      // Use localStorage as immediate fallback
      const localHistory = localStorage.getItem(`claim_history_${address.toLowerCase()}`);
      if (!supabaseClient && localHistory) {
        return JSON.parse(localHistory) || [];
      }
      
      try {
        const { data, error } = await supabaseClient
          .from('claim_history')
          .select('*')
          .eq('wallet_address', address.toLowerCase())
          .order('timestamp', { ascending: false })
          .limit(10);
        
        if (error) {
          console.error('Error fetching claim history:', error);
          return localHistory ? JSON.parse(localHistory) || [] : [];
        }
        
        return data || [];
      } catch (e) {
        console.error('Error fetching claim history:', e);
        return localHistory ? JSON.parse(localHistory) || [] : [];
      }
    }

    async function saveClaimHistory(address, claimData) {
      if (!address) return;
      
      // Save to localStorage first
      const key = `claim_history_${address.toLowerCase()}`;
      const history = JSON.parse(localStorage.getItem(key) || '[]');
      history.unshift(claimData);
      if (history.length > 10) history.pop();
      localStorage.setItem(key, JSON.stringify(history));
      
      // Then try Supabase (non-blocking)
      if (supabaseClient) {
        supabaseClient
          .from('claim_history')
          .insert({
            wallet_address: address.toLowerCase(),
            xp_amount: claimData.xpAmount,
            token_amount: claimData.tokenAmount,
            tx_hash: claimData.txHash,
            timestamp: new Date().toISOString()
          })
          .then(({ error }) => {
            if (error) {
              console.error('Error saving claim history:', error);
            }
          })
          .catch(e => {
            console.error('Error saving claim history:', e);
          });
      }
    }

    async function updateXPDisplay() {
      if (appState.connected && appState.address) {
        // Show current value immediately
        const currentDisplay = document.getElementById('xp').textContent;
        
        // Get XP (with timeout to prevent hanging)
        const xpPromise = getWalletXP(appState.address);
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(parseInt(currentDisplay) || 0), 1000));
        
        const walletXP = await Promise.race([xpPromise, timeoutPromise]);
        
        // Get claimed XP to calculate available XP
        const claimedAmount = await getClaimedXPAmount(appState.address);
        const availableXP = Math.max(0, walletXP - claimedAmount);
        
        document.getElementById('xp').textContent = availableXP;
        appState.xp = availableXP;
        appState.totalXP = walletXP;
        appState.claimedXP = claimedAmount;
        
        console.log(`📊 XP Display - Total: ${walletXP}, Claimed: ${claimedAmount}, Available: ${availableXP}`);
        
        // Update claim UI non-blocking
        if (activeTab === 'claim') {
          requestAnimationFrame(() => updateClaimUI());
        }
      } else {
        document.getElementById('xp').textContent = '0';
        appState.xp = 0;
        appState.totalXP = 0;
        appState.claimedXP = 0;
        updateClaimUI();
      }
    }

    // Update claim UI based on current XP
    async function updateClaimUI() {
      const claimableXP = appState.xp || 0;
      const claimableDOG = Math.floor(claimableXP / XP_TO_DOG_RATE);
      
      document.getElementById('claimableXP').textContent = claimableXP;
      document.getElementById('claimableDOG').textContent = claimableDOG;
      
      const claimButton = document.getElementById('claimButton');
      if (claimableXP >= XP_TO_DOG_RATE && appState.connected) {
        claimButton.disabled = false;
        claimButton.textContent = `💰 Claim ${claimableDOG} $DOG Tokens`;
      } else {
        claimButton.disabled = true;
        if (!appState.connected) {
          claimButton.textContent = '🔒 Connect Wallet First';
        } else if (claimableXP < XP_TO_DOG_RATE) {
          claimButton.textContent = `📈 Need ${XP_TO_DOG_RATE - claimableXP} more XP`;
        }
      }
      
      // Update token balance
      await updateTokenBalance();
      
      // Removed claim history display
    }

    // Update token balance display - Farcaster wallet compatible version
    async function updateTokenBalance() {
      if (!appState.connected || !appState.provider || !appState.address) {
        console.log('❌ Not connected, cannot fetch balance');
        document.getElementById('walletDogDisplay').textContent = '0';
        return;
      }
      
      console.log('🔄 Fetching DOG balance for:', appState.address);
      
      try {
        // Check if we're using Farcaster wallet
        const isFarcasterWallet = sdk && sdk.wallet && sdk.wallet.ethProvider;
        
        if (isFarcasterWallet) {
          console.log('🟣 Using Farcaster wallet - trying direct RPC call');
          
          // For Farcaster, try a direct eth_getBalance first to test connection
          try {
            const ethBalance = await appState.provider.getBalance(appState.address);
            console.log('ETH Balance:', ethers.utils.formatEther(ethBalance));
          } catch (e) {
            console.log('Basic balance check failed:', e);
          }
          
          // Try to get token balance using eth_call directly
          try {
            // Encode the balanceOf function call
            const iface = new ethers.utils.Interface([
              "function balanceOf(address account) public view returns (uint256)"
            ]);
            const data = iface.encodeFunctionData("balanceOf", [appState.address]);
            
            // Make the call using the provider's send method
            const result = await appState.provider.send("eth_call", [{
              to: CONTRACTS.DOG_TOKEN,
              data: data
            }, "latest"]);
            
            console.log('Raw result:', result);
            
            if (result && result !== '0x') {
              const balance = ethers.BigNumber.from(result);
              const formattedBalance = ethers.utils.formatUnits(balance, 18);
              const numBalance = parseFloat(formattedBalance);
              const displayBalance = numBalance >= 1 ? numBalance.toFixed(2) : 
                                   numBalance > 0 ? numBalance.toFixed(6) : '0';
              
              document.getElementById('walletDogDisplay').textContent = displayBalance;
              console.log(`✅ DOG Balance (Farcaster): ${displayBalance}`);
            } else {
              console.log('No balance or contract not found');
              document.getElementById('walletDogDisplay').textContent = '0';
            }
            
          } catch (callError) {
            console.error('Direct eth_call failed:', callError);
            
            // Fallback: Try using a public RPC endpoint
            console.log('Trying fallback RPC...');
            try {
              const fallbackProvider = new ethers.providers.JsonRpcProvider('https://testnet-rpc.monad.xyz');
              const dogTokenContract = new ethers.Contract(
                CONTRACTS.DOG_TOKEN,
                ["function balanceOf(address) view returns (uint256)"],
                fallbackProvider
              );
              
              const balance = await dogTokenContract.balanceOf(appState.address);
              const formattedBalance = ethers.utils.formatUnits(balance, 18);
              const numBalance = parseFloat(formattedBalance);
              const displayBalance = numBalance >= 1 ? numBalance.toFixed(2) : 
                                   numBalance > 0 ? numBalance.toFixed(6) : '0';
              
              document.getElementById('walletDogDisplay').textContent = displayBalance;
              console.log(`✅ DOG Balance (Fallback RPC): ${displayBalance}`);
              
            } catch (fallbackError) {
              console.error('Fallback RPC also failed:', fallbackError);
              document.getElementById('walletDogDisplay').textContent = '0';
            }
          }
          
        } else {
          // Regular wallet (MetaMask, etc.)
          console.log('🦊 Using regular wallet provider');
          
          const dogTokenContract = new ethers.Contract(
            CONTRACTS.DOG_TOKEN,
            ["function balanceOf(address) view returns (uint256)"],
            appState.provider
          );
          
          const balance = await dogTokenContract.balanceOf(appState.address);
          const formattedBalance = ethers.utils.formatUnits(balance, 18);
          const numBalance = parseFloat(formattedBalance);
          const displayBalance = numBalance >= 1 ? numBalance.toFixed(2) : 
                               numBalance > 0 ? numBalance.toFixed(6) : '0';
          
          document.getElementById('walletDogDisplay').textContent = displayBalance;
          console.log(`✅ DOG Balance: ${displayBalance}`);
        }
        
      } catch (error) {
        console.error('❌ Error fetching token balance:', error);
        
        // Last resort: Use localStorage cache if available
        const cachedBalance = localStorage.getItem(`dog_balance_${appState.address.toLowerCase()}`);
        if (cachedBalance) {
          document.getElementById('walletDogDisplay').textContent = cachedBalance;
          console.log(`📦 Using cached balance: ${cachedBalance}`);
        } else {
          document.getElementById('walletDogDisplay').textContent = '0';
        }
      }
    }

    // Display claim history - Removed
    async function displayClaimHistory() {
      // Function removed - no longer needed
      return;
    }

    // Claim tokens function with double-spend protection
    window.claimTokens = async function() {
      if (!appState.connected || !appState.signer) {
        showError('Please connect your wallet first');
        return;
      }
      
      const availableXP = appState.xp;
      const claimableDOG = Math.floor(availableXP / XP_TO_DOG_RATE);
      
      if (availableXP < XP_TO_DOG_RATE) {
        showError(`Need at least ${XP_TO_DOG_RATE} XP to claim tokens`);
        return;
      }
      
      try {
        console.log('💰 Starting token claim...');
        showStatus('claim-status', '🔐 Please confirm transaction in your wallet...', 'pending');
        
        // Ensure correct network
        await ensureMonadNetwork();
        
        // Call the actual DOG token contract
        const dogTokenContract = new ethers.Contract(
          CONTRACTS.DOG_TOKEN,
          ABIS.DOG_TOKEN,
          appState.signer
        );
        
        // Calculate XP to claim (must be multiple of 10)
        const xpToClaim = claimableDOG * XP_TO_DOG_RATE;
        
        console.log(`Claiming ${xpToClaim} XP for ${claimableDOG} DOG tokens`);
        
        // Execute claim transaction with proper gas limit
        const tx = await dogTokenContract.claim(xpToClaim, {
          gasLimit: 100000 // Reduced gas limit
        });
        
        showStatus('claim-status', `📡 Transaction sent: ${tx.hash.slice(0,10)}...`, 'pending');
        console.log('Transaction hash:', tx.hash);
        
        // Immediately update claimed XP to prevent double-spending
        await saveClaimedXP(appState.address, xpToClaim);
        
        // Update local XP immediately
        const remainingXP = availableXP - xpToClaim;
        appState.xp = remainingXP;
        appState.claimedXP = (appState.claimedXP || 0) + xpToClaim;
        
        // Update display immediately
        document.getElementById('xp').textContent = remainingXP;
        await updateClaimUI();
        
        // Wait for confirmation (but don't wait too long for Farcaster wallet)
        setTimeout(async () => {
          try {
            // Try to get updated balance with multiple retries
            const updateBalanceWithRetry = async (retries = 3) => {
              for (let i = 0; i < retries; i++) {
                try {
                  await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
                  
                  const newBalance = await dogTokenContract.balanceOf(appState.address);
                  const decimals = await dogTokenContract.decimals();
                  const formattedBalance = ethers.utils.formatUnits(newBalance, decimals);
                  
                  const numBalance = parseFloat(formattedBalance);
                  const displayBalance = numBalance >= 1 ? numBalance.toFixed(2) : numBalance.toFixed(6);
                  
                  document.getElementById('walletDogDisplay').textContent = displayBalance;
                  
                  // Cache the balance for Farcaster wallet
                  localStorage.setItem(`dog_balance_${appState.address.toLowerCase()}`, displayBalance);
                  
                  console.log(`✅ Balance updated after claim (attempt ${i + 1}): ${displayBalance} DOG`);
                  break;
                } catch (e) {
                  console.log(`Balance update attempt ${i + 1} failed, retrying...`);
                }
              }
            };
            
            updateBalanceWithRetry();
            
            // Save claim history
            await saveClaimHistory(appState.address, {
              xpAmount: xpToClaim,
              tokenAmount: claimableDOG,
              txHash: tx.hash
            });
            
            // Update UI
            await updateXPDisplay();
            showStatus('claim-status', `✅ Successfully claimed ${claimableDOG} $DOG tokens!`, 'success');
            
            // Show achievement with auto-close fallback
            showAchievementModal({
              icon: '💰',
              title: 'Tokens Claimed!',
              description: `You've successfully claimed ${claimableDOG} $DOG tokens! They are now in your wallet.`,
              type: 'claim',
              data: { amount: claimableDOG }
            });
            
            // Auto-close after 10 seconds if user doesn't interact
            setTimeout(() => {
              const modal = document.getElementById('achievementModal');
              if (modal && modal.style.display === 'flex') {
                console.log('Auto-closing achievement modal');
                closeAchievementModal();
              }
            }, 10000);
            
            setTimeout(() => hideStatus('claim-status'), 5000);
            
          } catch (e) {
            console.log('Post-claim update error:', e);
            // Still show success since transaction was sent
            await updateXPDisplay();
            showStatus('claim-status', `✅ Claim transaction sent! Tokens will arrive soon.`, 'success');
            setTimeout(() => hideStatus('claim-status'), 5000);
          }
        }, 5000);
        
      } catch (error) {
        console.error('❌ Claim error:', error);
        let errorMsg = 'Failed to claim tokens';
        
        if (error.message.includes('user rejected')) {
          errorMsg = 'Transaction cancelled';
        } else if (error.message.includes('insufficient funds')) {
          errorMsg = 'Insufficient gas funds';
        } else if (error.message.includes('XP already claimed')) {
          errorMsg = 'This XP has already been claimed';
          // Update claimed XP from contract
          const claimed = await getClaimedXPAmount(appState.address);
          appState.claimedXP = claimed;
          await updateXPDisplay();
        } else if (error.message.includes('Invalid XP amount')) {
          errorMsg = 'Invalid XP amount. Must be multiple of 10';
        }
        
        showStatus('claim-status', errorMsg, 'error');
        setTimeout(() => hideStatus('claim-status'), 5000);
      }
    };
    
    // Update claimed stats - Simplified version without complex stats
    async function updateClaimedStats() {
      // This function is no longer needed since we removed the stats
      return;
    }

    // Contract interaction tracking with Supabase - optimized
    async function getContractInteractions(address) {
      const defaultData = {
        pet: 0,
        gm: 0,
        gn: 0,
        flip: 0,
        total: 0,
        firstInteraction: null,
        lastInteraction: null
      };
      
      if (!address) return defaultData;
      
      // Get from localStorage first (immediate)
      const localData = localStorage.getItem(`contract_interactions_${address.toLowerCase()}`);
      if (!supabaseClient && localData) {
        return JSON.parse(localData) || defaultData;
      }
      
      try {
        const { data, error } = await supabaseClient
          .from('contract_interactions')
          .select('*')
          .eq('wallet_address', address.toLowerCase())
          .single();
        
        if (error || !data) {
          return localData ? JSON.parse(localData) || defaultData : defaultData;
        }
        
        return {
          pet: data.pet_count || 0,
          gm: data.gm_count || 0,
          gn: data.gn_count || 0,
          flip: data.flip_count || 0,
          total: data.total_interactions || 0,
          firstInteraction: data.first_interaction,
          lastInteraction: data.last_interaction
        };
      } catch (e) {
        console.error('Error fetching interactions:', e);
        return localData ? JSON.parse(localData) || defaultData : defaultData;
      }
    }

    async function saveContractInteraction(address, contractType) {
      try {
        // Get current data
        const currentData = await getContractInteractions(address);
        
        // Increment the specific interaction
        const updates = {
          wallet_address: address.toLowerCase(),
          pet_count: currentData.pet + (contractType === 'pet' ? 1 : 0),
          gm_count: currentData.gm + (contractType === 'gm' ? 1 : 0),
          gn_count: currentData.gn + (contractType === 'gn' ? 1 : 0),
          flip_count: currentData.flip + (contractType === 'flip' ? 1 : 0),
          last_interaction: new Date().toISOString()
        };
        
        updates.total_interactions = updates.pet_count + updates.gm_count + updates.gn_count + updates.flip_count;
        
        if (!currentData.firstInteraction) {
          updates.first_interaction = new Date().toISOString();
        }
        
        // Save to localStorage first (immediate)
        const localData = {
          pet: updates.pet_count,
          gm: updates.gm_count,
          gn: updates.gn_count,
          flip: updates.flip_count,
          total: updates.total_interactions,
          lastInteraction: updates.last_interaction,
          firstInteraction: updates.first_interaction || currentData.firstInteraction
        };
        localStorage.setItem(`contract_interactions_${address.toLowerCase()}`, JSON.stringify(localData));
        
        // Then try Supabase (non-blocking)
        if (supabaseClient) {
          supabaseClient
            .from('contract_interactions')
            .upsert(updates, {
              onConflict: 'wallet_address'
            })
            .then(({ error }) => {
              if (!error) {
                console.log(`📊 Contract interaction saved: ${contractType} for ${address}`);
                // Don't await - refresh leaderboard in background
                populateLeaderboard();
              }
            })
            .catch(e => {
              console.error('Error saving interaction:', e);
            });
        }
        
        return localData;
      } catch (e) {
        console.error('Error saving interaction:', e);
        return currentData;
      }
    }

    async function getAllContractInteractions() {
      // First check localStorage for immediate response
      const allUsers = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('contract_interactions_')) {
          const address = key.replace('contract_interactions_', '');
          const data = JSON.parse(localStorage.getItem(key));
          if (data && data.total > 0) {
            allUsers.push({
              address: address,
              ...data
            });
          }
        }
      }
      
      // If Supabase is available, fetch from there too
      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient
            .from('contract_interactions')
            .select('*')
            .order('total_interactions', { ascending: false })
            .limit(50);
          
          if (!error && data) {
            return data.map(user => ({
              address: user.wallet_address,
              pet: user.pet_count || 0,
              gm: user.gm_count || 0,
              gn: user.gn_count || 0,
              flip: user.flip_count || 0,
              total: user.total_interactions || 0,
              firstInteraction: user.first_interaction,
              lastInteraction: user.last_interaction
            }));
          }
        } catch (e) {
          console.error('Error fetching all interactions:', e);
        }
      }
      
      // Return localStorage data if Supabase fails
      allUsers.sort((a, b) => b.total - a.total);
      return allUsers;
    }

    function getBadgeForInteractions(interactions) {
      const { total } = interactions;
      
      if (total >= 100) return "Legend";
      if (total >= 50) return "Master";
      if (total >= 25) return "Expert"; 
      if (total >= 10) return "Active";
      if (total >= 5) return "Regular";
      if (total >= 1) return "Newbie";
      return "";
    }

    function getActivityBadge(interactions) {
      const { pet, gm, gn, flip } = interactions;
      
      if (pet >= 20) return "Dog Lover 🐕";
      if (gm + gn >= 30) return "Community Spirit 👋";
      if (flip >= 25) return "Lucky Gambler 🎰";
      if (pet >= 10 && gm + gn >= 10 && flip >= 10) return "All-Rounder ⭐";
      
      return "";
    }

    function getContractType(contractAddress, methodName) {
      if (contractAddress === CONTRACTS.PET && methodName === 'pet') return 'pet';
      if (contractAddress === CONTRACTS.GREET && methodName === 'gm') return 'gm';
      if (contractAddress === CONTRACTS.GREET && methodName === 'gn') return 'gn';
      if (contractAddress === CONTRACTS.FLIP && methodName === 'flip') return 'flip';
      return 'unknown';
    }

    // Global claim state management
    let claimState = {
      isProcessing: false,
      lastClaimTimestamp: 0,
      processingTxHash: null
    };

    // Check if claim is in progress across tabs/devices
    async function isClaimInProgress(address) {
      if (!address) return false;
      
      const claimKey = `claim_processing_${address.toLowerCase()}`;
      
      // Check localStorage for cross-tab sync
      const localClaimData = localStorage.getItem(claimKey);
      if (localClaimData) {
        try {
          const data = JSON.parse(localClaimData);
          const now = Date.now();
          // If claim was started less than 60 seconds ago, it's still processing
          if (data.timestamp && (now - data.timestamp) < 60000) {
            console.log('⏳ Claim in progress detected:', data);
            return true;
          }
        } catch (e) {
          console.error('Error parsing claim data:', e);
        }
      }
      
      // Check Supabase for cross-device sync
      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient
            .from('claim_locks')
            .select('*')
            .eq('wallet_address', address.toLowerCase())
            .single();
          
          if (data && !error) {
            const now = Date.now();
            const lockTime = new Date(data.locked_at).getTime();
            // If locked less than 60 seconds ago, claim is in progress
            if ((now - lockTime) < 60000) {
              console.log('⏳ Claim lock found in Supabase:', data);
              return true;
            }
          }
        } catch (e) {
          console.error('Error checking Supabase claim lock:', e);
        }
      }
      
      return false;
    }

    // Set claim lock across tabs/devices
    async function setClaimLock(address, txHash) {
      if (!address) return;
      
      const claimKey = `claim_processing_${address.toLowerCase()}`;
      const lockData = {
        timestamp: Date.now(),
        txHash: txHash,
        address: address.toLowerCase()
      };
      
      // Set in localStorage for immediate cross-tab sync
      localStorage.setItem(claimKey, JSON.stringify(lockData));
      
      // Set in Supabase for cross-device sync
      if (supabaseClient) {
        try {
          await supabaseClient
            .from('claim_locks')
            .upsert({
              wallet_address: address.toLowerCase(),
              tx_hash: txHash,
              locked_at: new Date().toISOString()
            }, {
              onConflict: 'wallet_address'
            });
          console.log('🔒 Claim lock set in Supabase');
        } catch (e) {
          console.error('Error setting Supabase claim lock:', e);
        }
      }
      
      // Broadcast to other tabs
      if (window.BroadcastChannel) {
        const channel = new BroadcastChannel('monad_dog_claim');
        channel.postMessage({
          type: 'claim_started',
          address: address.toLowerCase(),
          timestamp: Date.now()
        });
        channel.close();
      }
    }

    // Clear claim lock
    async function clearClaimLock(address) {
      if (!address) return;
      
      const claimKey = `claim_processing_${address.toLowerCase()}`;
      
      // Clear from localStorage
      localStorage.removeItem(claimKey);
      
      // Clear from Supabase
      if (supabaseClient) {
        try {
          await supabaseClient
            .from('claim_locks')
            .delete()
            .eq('wallet_address', address.toLowerCase());
          console.log('🔓 Claim lock cleared from Supabase');
        } catch (e) {
          console.error('Error clearing Supabase claim lock:', e);
        }
      }
      
      // Broadcast to other tabs
      if (window.BroadcastChannel) {
        const channel = new BroadcastChannel('monad_dog_claim');
        channel.postMessage({
          type: 'claim_completed',
          address: address.toLowerCase(),
          timestamp: Date.now()
        });
        channel.close();
      }
    }

    // Listen for claim events from other tabs
    if (window.BroadcastChannel) {
      const channel = new BroadcastChannel('monad_dog_claim');
      channel.onmessage = (event) => {
        console.log('📡 Received broadcast:', event.data);
        
        if (appState.connected && appState.address) {
          const currentAddress = appState.address.toLowerCase();
          const eventAddress = event.data.address;
          
          if (currentAddress === eventAddress) {
            if (event.data.type === 'claim_started') {
              // Disable claim button immediately
              const claimButton = document.getElementById('claimButton');
              if (claimButton) {
                claimButton.disabled = true;
                claimButton.textContent = '⏳ Claim in progress...';
              }
            } else if (event.data.type === 'claim_completed') {
              // Re-enable and update UI
              updateXPDisplay();
              updateClaimUI();
            }
          }
        }
      };
    }

    // Enhanced claim tokens function with double-spend protection
    window.claimTokens = async function() {
      if (!appState.connected || !appState.signer) {
        showError('Please connect your wallet first');
        return;
      }
      
      // Check if claim is already in progress
      if (claimState.isProcessing) {
        showError('Claim already in progress. Please wait...');
        return;
      }
      
      // Check cross-tab/device claim lock
      const isLocked = await isClaimInProgress(appState.address);
      if (isLocked) {
        showError('A claim is already being processed for this wallet. Please wait 60 seconds.');
        return;
      }
      
      const claimableXP = appState.xp;
      const claimableDOG = Math.floor(claimableXP / XP_TO_DOG_RATE);
      
      if (claimableXP < XP_TO_DOG_RATE) {
        showError(`Need at least ${XP_TO_DOG_RATE} XP to claim tokens`);
        return;
      }
      
      try {
        // Set processing state
        claimState.isProcessing = true;
        claimState.lastClaimTimestamp = Date.now();
        
        // Disable claim button immediately
        const claimButton = document.getElementById('claimButton');
        claimButton.disabled = true;
        claimButton.textContent = '⏳ Processing claim...';
        
        console.log('💰 Starting token claim...');
        showStatus('claim-status', '🔐 Please confirm transaction in your wallet...', 'pending');
        
        // Ensure correct network
        await ensureMonadNetwork();
        
        // Call the actual DOG token contract
        const dogTokenContract = new ethers.Contract(
          CONTRACTS.DOG_TOKEN,
          ABIS.DOG_TOKEN,
          appState.signer
        );
        
        // Calculate XP to claim (must be multiple of 10)
        const xpToClaim = claimableDOG * XP_TO_DOG_RATE;
        
        console.log(`Claiming ${xpToClaim} XP for ${claimableDOG} DOG tokens`);
        
        // Immediately deduct XP locally to prevent double-spend
        const remainingXP = claimableXP - xpToClaim;
        appState.xp = remainingXP;
        document.getElementById('xp').textContent = remainingXP;
        document.getElementById('claimableXP').textContent = remainingXP;
        document.getElementById('claimableDOG').textContent = Math.floor(remainingXP / XP_TO_DOG_RATE);
        
        // Save reduced XP immediately
        await saveWalletXP(appState.address, appState.totalXP);
        await saveClaimedXP(appState.address, xpToClaim);
        
        // Execute claim transaction with proper gas limit
        const tx = await dogTokenContract.claim(xpToClaim, {
          gasLimit: 90000
        });
        
        // Set claim lock with transaction hash
        await setClaimLock(appState.address, tx.hash);
        claimState.processingTxHash = tx.hash;
        
        showStatus('claim-status', `📡 Transaction sent: ${tx.hash.slice(0,10)}...`, 'pending');
        console.log('Transaction hash:', tx.hash);
        
        // Keep button disabled for 60 seconds
        let countdown = 60;
        const countdownInterval = setInterval(() => {
          countdown--;
          if (countdown > 0) {
            claimButton.textContent = `⏳ Please wait ${countdown}s...`;
          } else {
            clearInterval(countdownInterval);
          }
        }, 1000);
        
        // Wait for confirmation
        setTimeout(async () => {
          try {
            // Try to get updated balance with multiple retries
            const updateBalanceWithRetry = async (retries = 3) => {
              for (let i = 0; i < retries; i++) {
                try {
                  await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
                  
                  const newBalance = await dogTokenContract.balanceOf(appState.address);
                  const decimals = await dogTokenContract.decimals();
                  const formattedBalance = ethers.utils.formatUnits(newBalance, decimals);
                  
                  const numBalance = parseFloat(formattedBalance);
                  const displayBalance = numBalance >= 1 ? numBalance.toFixed(2) : numBalance.toFixed(6);
                  
                  document.getElementById('walletDogDisplay').textContent = displayBalance;
                  
                  // Cache the balance
                  localStorage.setItem(`dog_balance_${appState.address.toLowerCase()}`, displayBalance);
                  
                  console.log(`✅ Balance updated after claim (attempt ${i + 1}): ${displayBalance} DOG`);
                  break;
                } catch (e) {
                  console.log(`Balance update attempt ${i + 1} failed, retrying...`);
                }
              }
            };
            
            updateBalanceWithRetry();
            
            // Save claim history
            await saveClaimHistory(appState.address, {
              xpAmount: xpToClaim,
              tokenAmount: claimableDOG,
              txHash: tx.hash
            });
            
            // Update UI
            await updateXPDisplay();
            showStatus('claim-status', `✅ Successfully claimed ${claimableDOG} $DOG tokens!`, 'success');
            
            // Show achievement
            showAchievementModal({
              icon: '💰',
              title: 'Tokens Claimed!',
              description: `You've successfully claimed ${claimableDOG} $DOG tokens! They are now in your wallet.`,
              type: 'claim',
              data: { amount: claimableDOG }
            });
            
            setTimeout(() => hideStatus('claim-status'), 5000);
            
          } catch (e) {
            console.log('Post-claim update error:', e);
            showStatus('claim-status', `✅ Claim transaction sent! Tokens will arrive soon.`, 'success');
            setTimeout(() => hideStatus('claim-status'), 5000);
          } finally {
            // Clear processing state and lock after 60 seconds
            setTimeout(async () => {
              claimState.isProcessing = false;
              claimState.processingTxHash = null;
              await clearClaimLock(appState.address);
              
              // Re-enable button and update UI
              await updateClaimUI();
              console.log('🔓 Claim process completed, button re-enabled');
            }, 60000);
          }
        }, 5000);
        
      } catch (error) {
        console.error('❌ Claim error:', error);
        
        // Revert XP if transaction failed
        appState.xp = claimableXP;
        await saveWalletXP(appState.address, appState.totalXP);
        await updateXPDisplay();
        
        // Clear processing state
        claimState.isProcessing = false;
        claimState.processingTxHash = null;
        await clearClaimLock(appState.address);
        
        let errorMsg = 'Failed to claim tokens';
        
        if (error.message.includes('user rejected')) {
          errorMsg = 'Transaction cancelled';
        } else if (error.message.includes('insufficient funds')) {
          errorMsg = 'Insufficient gas funds';
        } else if (error.message.includes('XP already claimed')) {
          errorMsg = 'This XP has already been claimed';
        } else if (error.message.includes('Invalid XP amount')) {
          errorMsg = 'Invalid XP amount. Must be multiple of 10';
        }
        
        showStatus('claim-status', errorMsg, 'error');
        setTimeout(() => {
          hideStatus('claim-status');
          updateClaimUI();
        }, 5000);
      }
    };

    // Update claim UI based on current XP with lock check
    async function updateClaimUI() {
      const claimableXP = appState.xp || 0;
      const claimableDOG = Math.floor(claimableXP / XP_TO_DOG_RATE);
      
      document.getElementById('claimableXP').textContent = claimableXP;
      document.getElementById('claimableDOG').textContent = claimableDOG;
      
      const claimButton = document.getElementById('claimButton');
      
      // Check if claim is in progress
      const isLocked = await isClaimInProgress(appState.address);
      
      if (isLocked) {
        claimButton.disabled = true;
        claimButton.textContent = '⏳ Claim in progress...';
      } else if (claimableXP >= XP_TO_DOG_RATE && appState.connected) {
        claimButton.disabled = false;
        claimButton.textContent = `💰 Claim ${claimableDOG} $DOG Tokens`;
      } else {
        claimButton.disabled = true;
        if (!appState.connected) {
          claimButton.textContent = '🔒 Connect Wallet First';
        } else if (claimableXP < XP_TO_DOG_RATE) {
          claimButton.textContent = `📈 Need ${XP_TO_DOG_RATE - claimableXP} more XP`;
        }
      }
      
      // Update token balance
      await updateTokenBalance();
    }

    // Global state 
    let appState = {
      connected: false,
      address: null,
      xp: 0,
      totalXP: 0,
      claimedXP: 0,
      provider: null,
      signer: null,
      isTransactionPending: false
    };

    // Initialize SDK
    let sdk = null;
    
    async function initApp() {
      // Use the enhanced initialization with progress
      await initializeAppWithProgress();
    }

    function setupEventListeners() {
      document.getElementById('connect-btn').onclick = connectWallet;
      document.getElementById('disconnect-btn').onclick = disconnect;
    }

    // Disable all action buttons during transaction
    function disableAllActionButtons() {
      const buttons = [
        ...document.querySelectorAll('#pet button'),
        ...document.querySelectorAll('#greet button'),
        ...document.querySelectorAll('#flip button'),
        document.getElementById('claimButton')
      ];
      
      buttons.forEach(button => {
        if (button && !button.id.includes('disconnect') && !button.classList.contains('tab') && !button.classList.contains('share-button')) {
          button.disabled = true;
          button.dataset.originalText = button.textContent;
        }
      });
      
      appState.isTransactionPending = true;
    }

    // Enable all action buttons after transaction
    function enableAllActionButtons() {
      const buttons = [
        ...document.querySelectorAll('#pet button'),
        ...document.querySelectorAll('#greet button'),
        ...document.querySelectorAll('#flip button'),
        document.getElementById('claimButton')
      ];
      
      buttons.forEach(button => {
        if (button && !button.id.includes('disconnect') && !button.classList.contains('tab') && !button.classList.contains('share-button')) {
          button.disabled = false;
          if (button.dataset.originalText) {
            button.textContent = button.dataset.originalText;
            delete button.dataset.originalText;
          }
        }
      });
      
      appState.isTransactionPending = false;
      
      // Update claim button state
      if (activeTab === 'claim') {
        updateClaimUI();
      }
    }

    function setupGameFunctions() {
      // Define all game functions globally
      window.petDog = async function() {
        console.log('🐕 Pet Dog clicked!');
        
        if (!appState.connected) {
          console.log('❌ Wallet not connected');
          showError('Connect wallet first');
          return;
        }
        
        if (appState.isTransactionPending) {
          showError('Please wait for the current transaction to complete');
          return;
        }
        
        console.log('✅ Wallet connected, starting pet transaction');
        
        // Change dog image
        document.getElementById('dog-img').src = `https://placedog.net/400/300?id=${Math.floor(Math.random() * 50) + 1}`;
        
        // Execute real blockchain transaction
        await executeTransaction(
          CONTRACTS.PET,
          ABIS.PET,
          'pet',
          'pet-status',
          '🐕 Dog petted successfully! +10 XP',
          10
        );
      };

      window.sayGM = async function() {
        console.log('☀️ Say GM clicked!');
        
        if (!appState.connected) {
          showError('Connect wallet first');
          return;
        }
        
        if (appState.isTransactionPending) {
          showError('Please wait for the current transaction to complete');
          return;
        }
        
        await executeTransaction(
          CONTRACTS.GREET,
          ABIS.GREET,
          'gm',
          'greet-status',
          '☀️ Good Morning sent! +5 XP',
          5
        );
      };

      window.sayGN = async function() {
        console.log('🌙 Say GN clicked!');
        
        if (!appState.connected) {
          showError('Connect wallet first');
          return;
        }
        
        if (appState.isTransactionPending) {
          showError('Please wait for the current transaction to complete');
          return;
        }
        
        await executeTransaction(
          CONTRACTS.GREET,
          ABIS.GREET,
          'gn',
          'greet-status',
          '🌙 Good Night sent! +5 XP',
          5
        );
      };

      window.flipCoin = async function() {
        console.log('🪙 Flip Coin clicked!');
        
        if (!appState.connected) {
          showError('Connect wallet first');
          return;
        }
        
        if (appState.isTransactionPending) {
          showError('Please wait for the current transaction to complete');
          return;
        }
        
        const coin = document.getElementById('coin');
        const result = document.getElementById('flip-result');
        
        // Start visual animation
        result.textContent = 'Flipping...';
        let rotation = 0;
        const interval = setInterval(() => {
          rotation += 180;
          coin.style.transform = `rotateY(${rotation}deg)`;
        }, 100);
        
        // Execute real transaction
        await executeTransaction(
          CONTRACTS.FLIP,
          ABIS.FLIP,
          'flip',
          'flip-status',
          '🪙 Coin flipped! +3 XP',
          3
        );
        
        // Stop animation after transaction starts
        setTimeout(() => {
          clearInterval(interval);
          const finalResult = Math.random() < 0.5 ? 'Heads' : 'Tails';
          coin.style.transform = `rotateY(${finalResult === 'Heads' ? 0 : 180}deg)`;
          result.textContent = `Result: ${finalResult}!`;
        }, 3000);
      };

      window.showTab = function(tabName) {
        console.log('📑 Switching to tab:', tabName);
        activeTab = tabName;
        
        // Update tabs
        document.querySelectorAll('.tab').forEach(tab => {
          tab.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
        
        // Update claim UI when switching to claim tab
        if (tabName === 'claim') {
          updateClaimUI();
          // Update balance with delay for better reliability
          setTimeout(() => {
            updateTokenBalance();
          }, 500);
        }
      };

      // Preload critical resources
      preloadResources();
      
      // Setup periodic claim lock cleanup (every 5 minutes)
      setInterval(async () => {
        if (appState.connected && appState.address) {
          const claimKey = `claim_processing_${appState.address.toLowerCase()}`;
          const localClaimData = localStorage.getItem(claimKey);
          
          if (localClaimData) {
            try {
              const data = JSON.parse(localClaimData);
              const now = Date.now();
              // If claim lock is older than 60 seconds, clear it
              if (data.timestamp && (now - data.timestamp) > 60000) {
                localStorage.removeItem(claimKey);
                console.log('🧹 Cleaned up expired claim lock');
                updateClaimUI();
              }
            } catch (e) {
              console.error('Error cleaning claim lock:', e);
            }
          }
        }
      }, 300000); // 5 minutes
      
      console.log('🎮 Game functions setup complete');
    }

    function hideLoading() {
      // Legacy function - now uses enhanced loading state
      hideLoadingState();
    }

    async function connectWallet() {
      try {
        console.log('Connecting wallet...');
        
        // Show loading state
        const connectBtn = document.getElementById('connect-btn');
        connectBtn.textContent = '🔄 Connecting...';
        connectBtn.disabled = true;
        
        let provider;
        
        if (sdk && sdk.wallet && sdk.wallet.ethProvider) {
          console.log('Using Farcaster wallet');
          provider = sdk.wallet.ethProvider;
        } else if (window.ethereum) {
          console.log('Using browser wallet');
          provider = window.ethereum;
        } else {
          throw new Error('No wallet available');
        }

        // Request accounts with timeout
        const accountsPromise = provider.request({
          method: 'eth_requestAccounts'
        });
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 10000)
        );
        
        const accounts = await Promise.race([accountsPromise, timeoutPromise]);

        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts found');
        }

        console.log('✅ Connected:', accounts[0]);

        // Setup ethers
        appState.provider = new ethers.providers.Web3Provider(provider);
        appState.signer = appState.provider.getSigner();
        appState.address = accounts[0];
        appState.connected = true;

        // Update UI and load wallet-specific data
        updateWalletUI();
        
        // Load data asynchronously
        updateXPDisplay().catch(console.error);
        
        // Ensure network is correct before fetching balance
        await ensureMonadNetwork();
        
        // Update token balance with multiple retries
        const fetchBalance = async () => {
          for (let i = 0; i < 3; i++) {
            try {
              await updateTokenBalance();
              break;
            } catch (e) {
              console.log(`Balance fetch attempt ${i + 1} failed, retrying...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        };
        
        fetchBalance();

      } catch (error) {
        console.error('Connection error:', error);
        showError(error.message);
        
        // Reset button
        const connectBtn = document.getElementById('connect-btn');
        connectBtn.textContent = '🟣 Connect Wallet';
        connectBtn.disabled = false;
      }
    }

    async function disconnect() {
      appState = {
        connected: false,
        address: null,
        xp: 0,
        totalXP: 0,
        claimedXP: 0,
        provider: null,
        signer: null
      };
      updateWalletUI();
      await updateXPDisplay();
      console.log('🔌 Wallet disconnected, XP reset to 0');
    }

    function updateWalletUI() {
      const connectArea = document.getElementById('connect-area');
      const connectedArea = document.getElementById('connected-area');
      const addressEl = document.getElementById('address');

      if (appState.connected) {
        connectArea.style.display = 'none';
        connectedArea.style.display = 'block';
        addressEl.textContent = appState.address.slice(0,6) + '...' + appState.address.slice(-4);
      } else {
        connectArea.style.display = 'block';
        connectedArea.style.display = 'none';
      }
    }

    async function addXP(amount) {
      if (!appState.connected || !appState.address) {
        console.log('❌ Cannot add XP: wallet not connected');
        return;
      }
      
      // Add XP to total wallet XP
      appState.totalXP = (appState.totalXP || 0) + amount;
      appState.xp = Math.max(0, appState.totalXP - (appState.claimedXP || 0));
      
      // Update display immediately
      document.getElementById('xp').textContent = appState.xp;
      
      // Save total XP to Supabase in background (non-blocking)
      saveWalletXP(appState.address, appState.totalXP);
      
      // Update claim UI non-blocking
      requestAnimationFrame(() => updateClaimUI());
      
      // Add celebration effect
      const xpElement = document.getElementById('xp');
      xpElement.style.transform = 'scale(1.2)';
      xpElement.style.color = '#00ff00';
      
      setTimeout(() => {
        xpElement.style.transform = 'scale(1)';
        xpElement.style.color = 'white';
      }, 500);
      
      console.log(`✨ XP added to ${appState.address}: +${amount}, Total: ${appState.totalXP}, Available: ${appState.xp}`);
    }

    function showStatus(id, message, type) {
      const el = document.getElementById(id);
      el.textContent = message;
      el.className = `status visible ${type}`;
    }

    function hideStatus(id) {
      document.getElementById(id).className = 'status';
    }

    function showError(message) {
      const div = document.createElement('div');
      div.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:rgba(255,0,0,0.9);color:white;padding:10px 20px;border-radius:8px;z-index:1000;';
      div.textContent = message;
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 5000);
    }

    // Real transaction function
    async function executeTransaction(contractAddress, abi, methodName, statusId, successMsg, xpAmount) {
      if (!appState.connected) {
        showError('Connect wallet first');
        return;
      }

      if (appState.isTransactionPending) {
        showError('Please wait for the current transaction to complete');
        return;
      }

      try {
        console.log('🔗 Starting transaction:', methodName);
        
        // Disable all action buttons
        disableAllActionButtons();
        
        showStatus(statusId, 'Preparing transaction...', 'pending');

        // Ensure Monad network
        await ensureMonadNetwork();

        // Create contract instance
        const contract = new ethers.Contract(contractAddress, abi, appState.signer);
        
        showStatus(statusId, '🔐 Please confirm in your wallet...', 'pending');

        // Send transaction
        const tx = await contract[methodName]({
          gasLimit: 100000 // Reduced gas limit
        });

        console.log('✅ Transaction sent:', tx.hash);
        showStatus(statusId, `✅ Transaction sent: ${tx.hash.slice(0,10)}...`, 'pending');

        // Since Farcaster wallet doesn't support eth_getTransactionReceipt,
        // we'll assume success after a delay and track the interaction
        setTimeout(async () => {
          console.log('✅ Transaction assumed successful');
          showStatus(statusId, successMsg, 'success');
          await addXP(xpAmount);
          
          // Track contract interaction
          if (appState.connected && appState.address) {
            const contractType = getContractType(contractAddress, methodName);
            const interactionData = await saveContractInteraction(appState.address, contractType);
            console.log(`🎯 Contract interaction tracked: ${contractType}`);
            
            // Check for achievements
            checkAndShowAchievements(contractType, interactionData);
          }
          
          // Enable all buttons
          enableAllActionButtons();
          
          setTimeout(() => hideStatus(statusId), 3000);
        }, 5000);

      } catch (error) {
        console.error('❌ Transaction error:', error);
        
        // Enable all buttons on error
        enableAllActionButtons();
        
        let errorMsg = 'Transaction failed';
        if (error.message.includes('user rejected') || error.code === 4001) {
          errorMsg = 'Transaction cancelled by user';
        } else if (error.message.includes('insufficient funds')) {
          errorMsg = 'Insufficient funds for gas';
        }

        showStatus(statusId, errorMsg, 'error');
        setTimeout(() => hideStatus(statusId), 5000);
      }
    }

    async function ensureMonadNetwork() {
      const MONAD_CHAIN_ID = '0x279F'; // 10143 in hex
      
      try {
        const provider = sdk && sdk.wallet && sdk.wallet.ethProvider 
          ? sdk.wallet.ethProvider 
          : window.ethereum;

        if (!provider) {
          throw new Error('No wallet provider available');
        }

        const chainId = await provider.request({ method: 'eth_chainId' });
        console.log('Current chain ID:', chainId);

        if (chainId !== MONAD_CHAIN_ID) {
          console.log('Switching to Monad Testnet...');
          
          try {
            await provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: MONAD_CHAIN_ID }],
            });
            console.log('Switched to Monad Testnet');
          } catch (switchError) {
            if (switchError.code === 4902) {
              console.log('Adding Monad Testnet...');
              await provider.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: MONAD_CHAIN_ID,
                  chainName: 'Monad Testnet',
                  nativeCurrency: {
                    name: 'Monad',
                    symbol: 'MONAD',
                    decimals: 18
                  },
                  rpcUrls: ['https://testnet-rpc.monad.xyz'],
                  blockExplorerUrls: ['https://testnet.monadscan.com/']
                }]
              });
              console.log('Monad Testnet added');
            }
          }

          // Recreate provider after network switch
          appState.provider = new ethers.providers.Web3Provider(provider);
          appState.signer = appState.provider.getSigner();
        }
      } catch (error) {
        console.error('Network switch error:', error);
        throw new Error('Failed to switch to Monad Testnet');
      }
    }

    async function populateLeaderboard() {
      const tbody = document.getElementById('leaderboardBody');
      if (!tbody) return;

      // Show loading state
      tbody.innerHTML = `
        <tr>
          <td colspan="3" style="text-align: center; padding: 20px; color: rgba(255,255,255,0.7);">
            Loading contract interactions...
          </td>
        </tr>
      `;

      try {
        // Get all contract interactions from Supabase
        const contractUsers = await getAllContractInteractions();
        
        console.log('📊 Found', contractUsers.length, 'users with contract interactions');
        
        if (contractUsers.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="3" style="text-align: center; padding: 40px; color: rgba(255,255,255,0.7);">
                <div>🌟 Be the first to interact!</div>
                <div style="font-size: 11px; opacity: 0.7; margin-top: 8px;">
                  Pet the dog, say GM/GN, or flip coins to appear here
                </div>
              </td>
            </tr>
          `;
          return;
        }
        
        // Create leaderboard with contract interaction data
        const leaderboardData = contractUsers.map((user, index) => ({
          rank: index + 1,
          address: user.address,
          txCount: user.total,
          interactions: {
            pet: user.pet,
            gm: user.gm,
            gn: user.gn,
            flip: user.flip
          },
          badge: getBadgeForInteractions(user),
          activityBadge: getActivityBadge(user)
        }));
        
        // Populate table
        tbody.innerHTML = leaderboardData.map((item) => {
          const isCurrentUser = appState.connected && 
            item.address.toLowerCase() === appState.address?.toLowerCase();
          
          const interactionDetails = `🐕${item.interactions.pet} 👋${item.interactions.gm + item.interactions.gn} 🪙${item.interactions.flip}`;
          
          return `
            <tr style="${isCurrentUser ? 'background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.5);' : ''}" 
                title="Pet: ${item.interactions.pet}, GM/GN: ${item.interactions.gm + item.interactions.gn}, Flip: ${item.interactions.flip}">
              <td class="rank-number">#${item.rank}</td>
              <td class="address-cell">
                <div>${item.address.slice(0,6)}...${item.address.slice(-4)}</div>
                <div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">${interactionDetails}</div>
                ${item.activityBadge ? `<span class="badge" style="background: #ff6b9d;">${item.activityBadge}</span>` : ''}
                ${isCurrentUser ? '<span class="badge" style="background: #10b981;">You</span>' : ''}
              </td>
              <td class="tx-count">${item.txCount}</td>
            </tr>
          `;
        }).join('');

        console.log('✅ Leaderboard populated with contract interaction data');

      } catch (error) {
        console.error('❌ Error populating leaderboard:', error);
        
        tbody.innerHTML = `
          <tr>
            <td colspan="3" style="text-align: center; padding: 20px; color: #ff6b6b;">
              ⚠️ Failed to load leaderboard data
            </td>
          </tr>
        `;
      }
    }

    window.refreshLeaderboard = async function() {
      console.log('🔄 Refreshing Monad Dog leaderboard...');
      await populateLeaderboard();
      console.log('✅ Leaderboard refreshed with latest contract interactions');
    };

    // Farcaster Sharing Functions
    function generateShareableContent(type, data = {}) {
      const baseUrl = window.location.origin;
      const userStats = appState.connected ? getContractInteractions(appState.address) : null;
      const tokenBalance = document.getElementById('walletDogDisplay')?.textContent || '0';
      
      const shareTemplates = {
        pet: {
          text: `Just petted the Monad Dog! 🐕✨\n\nTotal pets: ${userStats?.pet || 0}\nXP earned: ${appState.xp}\n$DOG Balance: ${tokenBalance}\n\nJoin me on Monad Testnet!`,
          url: `${baseUrl}?ref=pet&xp=${appState.xp}`,
          image: "🐕"
        },
        greet: {
          text: `GM Monad community! ☀️👋\n\nTotal greetings: ${(userStats?.gm || 0) + (userStats?.gn || 0)}\nCommunity XP: ${appState.xp}\n$DOG Tokens: ${tokenBalance}\n\nSpread the love on Monad!`,
          url: `${baseUrl}?ref=greet&xp=${appState.xp}`,
          image: "👋"
        },
        flip: {
          text: `Just flipped a coin on Monad! 🪙\n\nResult: ${data.result || 'Lucky'}\nTotal flips: ${userStats?.flip || 0}\nXP: ${appState.xp}\n$DOG: ${tokenBalance}`,
          url: `${baseUrl}?ref=flip&result=${data.result}&xp=${appState.xp}`,
          image: "🪙"
        },
        claim: {
          text: `Just claimed ${data.amount || 0} $DOG tokens! 💰\n\nTotal $DOG Balance: ${tokenBalance}\nXP remaining: ${appState.xp}\n\nEarn XP and claim your $DOG tokens too!`,
          url: `${baseUrl}?ref=claim&tokens=${data.amount}`,
          image: "💰"
        },
        leaderboard: {
          text: `Check out my Monad Dog stats! 🏆\n\nRank: ${data.rank || '?'}\nTotal interactions: ${userStats?.total || 0}\nXP: ${appState.xp}\n$DOG Tokens: ${tokenBalance}\n\nCan you beat me?`,
          url: `${baseUrl}?ref=leaderboard&rank=${data.rank}&xp=${appState.xp}`,
          image: "🏆"
        },
        invite: {
          text: `Playing Monad Dog - the cutest way to explore Monad Testnet! 🐕⛓️\n\n✨ Pet dogs, flip coins, say GM/GN\n🎯 Earn XP and claim $DOG tokens\n💰 Convert XP to tokens (10:1 rate)\n🚀 Real blockchain interactions\n\nJoin me!`,
          url: `https://monad-snowy.vercel.app?ref=invite&inviter=${appState.address?.slice(0,6)}`,
          image: "🚀"
        }
      };
      
      return shareTemplates[type] || shareTemplates.invite;
    }

    function shareOnFarcaster(content) {
      try {
        if (sdk && sdk.actions && sdk.actions.openUrl) {
          // Use Farcaster SDK for sharing
          const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(content.text)}&embeds[]=${encodeURIComponent(content.url)}`;
          sdk.actions.openUrl(shareUrl);
          console.log('🚀 Shared via Farcaster SDK');
        } else {
          // Fallback to direct URL
          const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(content.text)}&embeds[]=${encodeURIComponent(content.url)}`;
          window.open(shareUrl, '_blank');
          console.log('🚀 Shared via direct URL');
        }
        
        // Track sharing event
        console.log('📊 Share event tracked:', content);
        
      } catch (error) {
        console.error('❌ Share error:', error);
        showError('Failed to open share dialog');
      }
    }

    // Achievement Modal Functions - Fixed with proper event handling
    window.showAchievementModal = function(achievement) {
      const modal = document.getElementById('achievementModal');
      const icon = document.getElementById('achievementIcon');
      const title = document.getElementById('achievementTitle');
      const description = document.getElementById('achievementDescription');
      
      if (!modal || !icon || !title || !description) {
        console.error('Achievement modal elements not found');
        return;
      }
      
      icon.textContent = achievement.icon || '🎉';
      title.textContent = achievement.title || 'Achievement!';
      description.textContent = achievement.description || '';
      
      modal.style.display = 'flex';
      
      // Store current achievement for sharing
      window.currentAchievement = achievement;
      
      // Add escape key listener
      window.achievementEscapeHandler = function(e) {
        if (e.key === 'Escape') {
          closeAchievementModal();
        }
      };
      document.addEventListener('keydown', window.achievementEscapeHandler);
      
      console.log('🎉 Achievement modal shown:', achievement);
    }

    window.closeAchievementModal = function() {
      const modal = document.getElementById('achievementModal');
      if (modal) {
        modal.style.display = 'none';
      }
      window.currentAchievement = null;
      
      // Remove escape key listener
      if (window.achievementEscapeHandler) {
        document.removeEventListener('keydown', window.achievementEscapeHandler);
      }
      
      console.log('Modal closed');
    }

    window.shareCurrentAchievement = function() {
      if (window.currentAchievement) {
        try {
          const content = generateShareableContent(window.currentAchievement.type, window.currentAchievement.data);
          shareOnFarcaster(content);
          
          // Close modal after sharing
          setTimeout(() => {
            closeAchievementModal();
          }, 500);
        } catch (error) {
          console.error('Error sharing achievement:', error);
          closeAchievementModal();
        }
      }
    }

    // Individual Share Functions
    window.sharePetAchievement = async function() {
      if (!appState.connected) {
        showError('Connect wallet to share achievements');
        return;
      }
      
      const userStats = await getContractInteractions(appState.address);
      const achievement = {
        icon: '🐕',
        title: 'Dog Lover Achievement!',
        description: `You've petted the dog ${userStats.pet} times and earned ${appState.xp} XP!`,
        type: 'pet',
        data: { pets: userStats.pet }
      };
      
      showAchievementModal(achievement);
    };

    window.shareGreetAchievement = async function() {
      if (!appState.connected) {
        showError('Connect wallet to share achievements');
        return;
      }
      
      const userStats = await getContractInteractions(appState.address);
      const totalGreets = userStats.gm + userStats.gn;
      const achievement = {
        icon: '👋',
        title: 'Community Spirit!',
        description: `You've greeted the community ${totalGreets} times! Spreading love on Monad.`,
        type: 'greet',
        data: { greets: totalGreets }
      };
      
      showAchievementModal(achievement);
    };

    window.shareFlipAchievement = async function() {
      if (!appState.connected) {
        showError('Connect wallet to share achievements');
        return;
      }
      
      const userStats = await getContractInteractions(appState.address);
      const lastResult = document.getElementById('flip-result').textContent;
      const achievement = {
        icon: '🪙',
        title: 'Lucky Flipper!',
        description: `${lastResult} You've flipped ${userStats.flip} coins on Monad!`,
        type: 'flip',
        data: { flips: userStats.flip, result: lastResult }
      };
      
      showAchievementModal(achievement);
    };

    window.shareLeaderboardPosition = async function() {
      showError('Leaderboard feature has been removed');
    };

    window.shareAppWithFriends = function() {
      const achievement = {
        icon: '🚀',
        title: 'Invite Friends!',
        description: 'Share Monad Dog with your friends and build the community together!',
        type: 'invite',
        data: {}
      };
      
      showAchievementModal(achievement);
    };

    // Auto-show achievements after major milestones
    function checkAndShowAchievements(interactionType, userStats) {
      const achievements = [];
      
      // Pet milestones
      if (interactionType === 'pet') {
        if (userStats.pet === 1) {
          achievements.push({
            icon: '🐕',
            title: 'First Pet!',
            description: 'You petted your first Monad Dog! Welcome to the pack!',
            type: 'pet'
          });
        } else if (userStats.pet === 10) {
          achievements.push({
            icon: '🐕',
            title: 'Dog Whisperer!',
            description: '10 pets! The dogs love you!',
            type: 'pet'
          });
        } else if (userStats.pet === 50) {
          achievements.push({
            icon: '🐕',
            title: 'Dog Master!',
            description: '50 pets! You are a true dog lover!',
            type: 'pet'
          });
        }
      }
      
      // Community milestones
      if (interactionType === 'gm' || interactionType === 'gn') {
        const totalGreets = userStats.gm + userStats.gn;
        if (totalGreets === 1) {
          achievements.push({
            icon: '👋',
            title: 'First Greeting!',
            description: 'Welcome to the Monad community!',
            type: 'greet'
          });
        } else if (totalGreets === 25) {
          achievements.push({
            icon: '👋',
            title: 'Community Champion!',
            description: '25 greetings! You spread so much positivity!',
            type: 'greet'
          });
        }
      }
      
      // Flip milestones
      if (interactionType === 'flip') {
        if (userStats.flip === 1) {
          achievements.push({
            icon: '🪙',
            title: 'First Flip!',
            description: 'Your first coin flip on Monad! Feeling lucky?',
            type: 'flip'
          });
        } else if (userStats.flip === 20) {
          achievements.push({
            icon: '🪙',
            title: 'High Roller!',
            description: '20 flips! Lady luck is on your side!',
            type: 'flip'
          });
        }
      }
      
      // XP milestones
      const totalXP = appState.totalXP;
      if (totalXP >= 100 && !localStorage.getItem(`xp_milestone_100_${appState.address}`)) {
        achievements.push({
          icon: '✨',
          title: 'XP Milestone!',
          description: '100 XP earned! You can now claim 10 $DOG tokens!',
          type: 'xp'
        });
        localStorage.setItem(`xp_milestone_100_${appState.address}`, 'true');
      }
      
      // Show first achievement if any
      if (achievements.length > 0) {
        setTimeout(() => {
          showAchievementModal(achievements[0]);
        }, 2000); // Show after transaction success message
      }
    }

    // Start app when DOM is ready with preloading
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        preloadResources();
        initApp();
      });
    } else {
      preloadResources();
      initApp();
    }

    console.log('📱 App script loaded');
    }); // End of DOMContentLoaded
  
