
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, AlertTriangle, FileSearch, TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Resources: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Educational Resources</h1>
        <p className="text-muted-foreground">
          Learn how to identify and combat misinformation effectively
        </p>
      </div>

      <Tabs defaultValue="spotting">
        <TabsList className="mb-4">
          <TabsTrigger value="spotting">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Spotting Fake News
          </TabsTrigger>
          <TabsTrigger value="methods">
            <FileSearch className="h-4 w-4 mr-2" />
            Fact-Checking Methods
          </TabsTrigger>
          <TabsTrigger value="patterns">
            <TrendingUp className="h-4 w-4 mr-2" />
            Misinformation Patterns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="spotting">
          <Card>
            <CardHeader>
              <CardTitle>How to Spot Fake News</CardTitle>
              <CardDescription>
                Essential skills for identifying misinformation online
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Check the Source</h3>
                <p>
                  Investigate the website, author, or publisher. Look for "About Us" pages, author
                  bios, and contact information. Reputable sources are transparent about who they are.
                </p>
                <Alert variant="default" className="bg-factcheck-blue/10 dark:bg-blue-900/20 mt-2">
                  <AlertDescription>
                    <strong>Tip:</strong> Unknown websites with strange URLs or those that end with 
                    ".co" or ".lo" (instead of ".com") might be impersonating legitimate news sources.
                  </AlertDescription>
                </Alert>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-xl font-medium">Read Beyond the Headline</h3>
                <p>
                  Headlines are designed to get clicks. Read the full article before sharing. 
                  Sometimes headlines are sensationalized while the actual content is more nuanced.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-xl font-medium">Check the Date</h3>
                <p>
                  Old news recirculated as if it's new is a common tactic. Check when the article 
                  was published. Sometimes old stories are shared without context, making them misleading.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-xl font-medium">Check Your Biases</h3>
                <p>
                  We're more likely to believe information that confirms our existing beliefs. 
                  Be especially critical of content that aligns with your views or triggers strong emotions.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-xl font-medium">Cross-Check with Other Sources</h3>
                <p>
                  If a story is true, other reputable sources will likely report it too. 
                  Check multiple sources to verify information, especially for extraordinary claims.
                </p>
                <Alert variant="default" className="bg-factcheck-green/10 dark:bg-green-900/20 mt-2">
                  <AlertDescription>
                    <strong>Pro tip:</strong> Use fact-checking websites like Snopes, FactCheck.org, or 
                    PolitiFact to verify viral stories and claims.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods">
          <Card>
            <CardHeader>
              <CardTitle>Fact-Checking Methods</CardTitle>
              <CardDescription>
                Professional techniques for verifying information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Primary Source Verification</h3>
                <p>
                  Always go back to the original source of information. Check official records, 
                  scientific papers, or direct quotes rather than relying on interpretations.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-xl font-medium">Reverse Image Search</h3>
                <p>
                  For images that seem suspicious, use Google Images, TinEye, or other reverse 
                  image search tools to find where an image originated and if it's been manipulated.
                </p>
                <Alert variant="default" className="bg-factcheck-blue/10 dark:bg-blue-900/20 mt-2">
                  <AlertDescription>
                    <strong>Tool tip:</strong> Google Images, TinEye and RevEye are excellent tools 
                    for verifying the authenticity and context of images.
                  </AlertDescription>
                </Alert>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-xl font-medium">Lateral Reading</h3>
                <p>
                  Instead of going deeper into a suspicious site, open new tabs and search for 
                  information about the site itself. Check what other sources say about the claim.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-xl font-medium">Check for Context</h3>
                <p>
                  Look for the full context of quotes or statistics. Partial information can be 
                  misleading even when technically true. Always look for what might be missing.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-xl font-medium">Consult Experts</h3>
                <p>
                  For complex topics, find what subject matter experts are saying. Look for 
                  consensus among experts rather than outlier opinions.
                </p>
                <Alert variant="default" className="bg-factcheck-green/10 dark:bg-green-900/20 mt-2">
                  <AlertDescription>
                    <strong>Remember:</strong> Expert consensus is more reliable than individual opinions, 
                    especially for scientific or technical matters.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns">
          <Card>
            <CardHeader>
              <CardTitle>Common Misinformation Patterns</CardTitle>
              <CardDescription>
                Recognize frequently used tactics in spreading false information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Emotional Manipulation</h3>
                <p>
                  Content designed to trigger strong emotions like fear, anger, or outrage
                  often spreads faster than nuanced information. Be cautious of content that
                  seems designed to make you emotional.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-xl font-medium">Out-of-Context Media</h3>
                <p>
                  Real photos or videos shown with false descriptions or in a misleading context.
                  Always verify that media matches the claimed event, date, and location.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-xl font-medium">False Experts</h3>
                <p>
                  People presented as authoritative sources who lack relevant credentials or
                  whose qualifications are exaggerated. Check credentials and expertise.
                </p>
                <Alert variant="default" className="bg-factcheck-red/10 dark:bg-red-900/20 mt-2">
                  <AlertDescription>
                    <strong>Warning sign:</strong> Claims of secret knowledge or assertions that all 
                    mainstream experts are wrong should raise immediate skepticism.
                  </AlertDescription>
                </Alert>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-xl font-medium">Coordinated Campaigns</h3>
                <p>
                  Multiple accounts spreading identical or similar content simultaneously to
                  create the impression of widespread belief. Look for unusual patterns.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-xl font-medium">Impersonation</h3>
                <p>
                  Fake websites or social media accounts that mimic legitimate news sources or
                  public figures. Always verify the official website or account.
                </p>
                <Alert variant="default" className="bg-factcheck-yellow/10 dark:bg-yellow-900/20 mt-2">
                  <AlertDescription>
                    <strong>Check:</strong> Verified badges on social media, official website URLs,
                    and writing style inconsistencies can help identify impersonations.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Resources;
