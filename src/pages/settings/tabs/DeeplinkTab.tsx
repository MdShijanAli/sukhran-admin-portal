import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ComboboxSelect } from "@/components/custom/ComboboxSelect";
import { toast } from "sonner";
import {
    Copy,
    ExternalLink,
    Globe,
    Home,
    Loader2,
    Link2,
    Package as PackageIcon,
    Sparkles,
    Tag,
} from "lucide-react";
import deeplinkService, { ShareLinkResponse } from "@/services/deeplinkService";
import productService from "@/services/productService";
import packageService from "@/services/packageService";
import categoryService from "@/services/categoryService";
import { useProductStore } from "@/stores/productStore";
import { usePackageStore } from "@/stores/packageStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { Product } from "@/stores/productStore";
import type { Package as PackageType } from "@/lib/types";
import { Category } from "@/stores/categoryStore";

type SourceType = "home" | "product" | "package" | "category";

function DeeplinkTab() {
    const { t } = useTranslation();

    const productStore = useProductStore();
    const packageStore = usePackageStore();
    const categoryStore = useCategoryStore();

    const [activeSource, setActiveSource] = useState<SourceType>("home");
    const [selectedProductId, setSelectedProductId] = useState<string>("");
    const [selectedPackageId, setSelectedPackageId] = useState<string>("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [generatedLink, setGeneratedLink] = useState<ShareLinkResponse | null>(
        null,
    );
    const [isGenerating, setIsGenerating] = useState(false);

    const sourceMeta = {
        home: {
            title: t("deeplink.sources.home"),
            description: t("deeplink.hints.home"),
            icon: Home,
        },
        product: {
            title: t("deeplink.sources.product"),
            description: t("deeplink.hints.product"),
            icon: PackageIcon,
        },
        package: {
            title: t("deeplink.sources.package"),
            description: t("deeplink.hints.package"),
            icon: Link2,
        },
        category: {
            title: t("deeplink.sources.category"),
            description: t("deeplink.hints.category"),
            icon: Tag,
        },
    }[activeSource];

    const copyToClipboard = async () => {
        if (!generatedLink?.share_url) return;

        try {
            await navigator.clipboard.writeText(generatedLink.share_url);
            toast.success(t("deeplink.messages.copied"));
        } catch (error) {
            console.error("Error copying deeplink:", error);
            toast.error(t("deeplink.messages.copyFailed"));
        }
    };

    const generateLink = async () => {
        try {
            setIsGenerating(true);

            let response: ShareLinkResponse;

            if (activeSource === "home") {
                response = await deeplinkService.generateHomeLink();
            } else if (activeSource === "product") {
                if (!selectedProductId) {
                    toast.error(t("deeplink.messages.selectionRequired"));
                    return;
                }
                response = await deeplinkService.generateProductLink(selectedProductId);
            } else if (activeSource === "package") {
                if (!selectedPackageId) {
                    toast.error(t("deeplink.messages.selectionRequired"));
                    return;
                }
                response = await deeplinkService.generatePackageLink(selectedPackageId);
            } else {
                if (!selectedCategoryId) {
                    toast.error(t("deeplink.messages.selectionRequired"));
                    return;
                }
                response = await deeplinkService.generateCategoryLink(selectedCategoryId);
            }

            setGeneratedLink(response);
            toast.success(t("deeplink.messages.generated"));
        } catch (error: any) {
            console.error("Error generating deeplink:", error);
            toast.error(error?.response?.data?.message || t("deeplink.messages.generateFailed"));
        } finally {
            setIsGenerating(false);
        }
    };

    const sourceLabel = sourceMeta.title;
    const SourceIcon = sourceMeta.icon;

    return (
        <div className="space-y-6">
            <Card className="overflow-hidden border-border/60 shadow-sm">
                <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-6 text-white">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="rounded-full bg-white/10 p-2 backdrop-blur-sm">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                                        {t("deeplink.tab")}
                                    </p>
                                    <h2 className="text-2xl font-semibold tracking-tight">
                                        {t("deeplink.title")}
                                    </h2>
                                </div>
                            </div>
                            <p className="max-w-3xl text-sm leading-6 text-white/75">
                                {t("deeplink.description")}
                            </p>
                        </div>

                        <Badge className="border-white/15 bg-white/10 px-3 py-1.5 text-white hover:bg-white/15">
                            <Globe className="mr-2 h-3.5 w-3.5" />
                            {t("deeplink.badge")}
                        </Badge>
                    </div>
                </div>

                <CardContent className="space-y-6 p-6">
                    <Tabs
                        value={activeSource}
                        onValueChange={(value) => {
                            setActiveSource(value as SourceType);
                            setGeneratedLink(null);
                        }}
                    >
                        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 md:grid-cols-4">
                            <TabsTrigger
                                value="home"
                                className="justify-start gap-2 rounded-lg border border-border/70 bg-background px-4 py-3 text-left data-[state=active]:border-primary data-[state=active]:shadow-sm"
                            >
                                <Home className="h-4 w-4" />
                                <span>{t("deeplink.sources.home")}</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="product"
                                className="justify-start gap-2 rounded-lg border border-border/70 bg-background px-4 py-3 text-left data-[state=active]:border-primary data-[state=active]:shadow-sm"
                            >
                                <PackageIcon className="h-4 w-4" />
                                <span>{t("deeplink.sources.product")}</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="package"
                                className="justify-start gap-2 rounded-lg border border-border/70 bg-background px-4 py-3 text-left data-[state=active]:border-primary data-[state=active]:shadow-sm"
                            >
                                <Link2 className="h-4 w-4" />
                                <span>{t("deeplink.sources.package")}</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="category"
                                className="justify-start gap-2 rounded-lg border border-border/70 bg-background px-4 py-3 text-left data-[state=active]:border-primary data-[state=active]:shadow-sm"
                            >
                                <Tag className="h-4 w-4" />
                                <span>{t("deeplink.sources.category")}</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="home" className="mt-6 space-y-4">
                            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                                <div className="rounded-2xl border bg-muted/30 p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-xl bg-primary/10 p-3 text-primary">
                                            <SourceIcon className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-base font-semibold">{sourceLabel}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {sourceMeta.description}
                                            </p>
                                        </div>
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="rounded-xl border border-dashed bg-background/80 p-4 text-sm text-muted-foreground">
                                        {t("deeplink.hints.home")}
                                    </div>
                                </div>

                                <div className="flex items-end">
                                    <Button
                                        onClick={generateLink}
                                        disabled={isGenerating}
                                        className="h-11 w-full"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {t("deeplink.actions.generating")}
                                            </>
                                        ) : (
                                            t("deeplink.actions.generate")
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="product" className="mt-6 space-y-4">
                            <div className="space-y-2">
                                <Label>{t("deeplink.selectors.product")}</Label>
                                <ComboboxSelect<Product>
                                    value={selectedProductId}
                                    onValueChange={(value) => {
                                        setSelectedProductId(String(value));
                                        setGeneratedLink(null);
                                    }}
                                    placeholder={t("deeplink.placeholders.product")}
                                    searchPlaceholder={t("deeplink.search.product")}
                                    emptyText={t("deeplink.empty.product")}
                                    service={productService}
                                    store={productStore}
                                    storeDataKey="products"
                                    getOptionValue={(option) => option.id}
                                    getOptionLabel={(option) => option.name}
                                    renderOption={(option) => (
                                        <div className="flex w-full flex-col items-start text-left">
                                            <span className="font-medium">{option.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {option.category?.name || option.slug}
                                            </span>
                                        </div>
                                    )}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {t("deeplink.hints.product")}
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={generateLink} disabled={isGenerating}>
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t("deeplink.actions.generating")}
                                        </>
                                    ) : (
                                        t("deeplink.actions.generate")
                                    )}
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="package" className="mt-6 space-y-4">
                            <div className="space-y-2">
                                <Label>{t("deeplink.selectors.package")}</Label>
                                <ComboboxSelect<PackageType>
                                    value={selectedPackageId}
                                    onValueChange={(value) => {
                                        setSelectedPackageId(String(value));
                                        setGeneratedLink(null);
                                    }}
                                    placeholder={t("deeplink.placeholders.package")}
                                    searchPlaceholder={t("deeplink.search.package")}
                                    emptyText={t("deeplink.empty.package")}
                                    service={packageService}
                                    store={packageStore}
                                    storeDataKey="packages"
                                    getOptionValue={(option) => option.id}
                                    getOptionLabel={(option) => option.name}
                                    renderOption={(option) => (
                                        <div className="flex w-full flex-col items-start text-left">
                                            <span className="font-medium">{option.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {t("deeplink.packagePrice", {
                                                    price: option.fixedPrice,
                                                })}
                                            </span>
                                        </div>
                                    )}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {t("deeplink.hints.package")}
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={generateLink} disabled={isGenerating}>
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t("deeplink.actions.generating")}
                                        </>
                                    ) : (
                                        t("deeplink.actions.generate")
                                    )}
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="category" className="mt-6 space-y-4">
                            <div className="space-y-2">
                                <Label>{t("deeplink.selectors.category")}</Label>
                                <ComboboxSelect<Category>
                                    value={selectedCategoryId}
                                    onValueChange={(value) => {
                                        setSelectedCategoryId(String(value));
                                        setGeneratedLink(null);
                                    }}
                                    placeholder={t("deeplink.placeholders.category")}
                                    searchPlaceholder={t("deeplink.search.category")}
                                    emptyText={t("deeplink.empty.category")}
                                    service={categoryService}
                                    store={categoryStore}
                                    storeDataKey="categories"
                                    getOptionValue={(option) => option.id}
                                    getOptionLabel={(option) => option.name}
                                    renderOption={(option) => (
                                        <div className="flex w-full flex-col items-start text-left">
                                            <span className="font-medium">{option.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {option.products_count
                                                    ? t("deeplink.categoryProducts", {
                                                        count: option.products_count,
                                                    })
                                                    : option.slug || t("deeplink.sources.category")}
                                            </span>
                                        </div>
                                    )}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {t("deeplink.hints.category")}
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={generateLink} disabled={isGenerating}>
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t("deeplink.actions.generating")}
                                        </>
                                    ) : (
                                        t("deeplink.actions.generate")
                                    )}
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
                <CardHeader>
                    <CardTitle>{t("deeplink.result.title")}</CardTitle>
                    <CardDescription>{t("deeplink.result.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    {generatedLink ? (
                        <div className="space-y-5">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="online">{t("deeplink.result.generated")}</Badge>
                                <Badge variant="secondary">{sourceLabel}</Badge>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="shareUrl">{t("deeplink.result.shareUrl")}</Label>
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <Input
                                        id="shareUrl"
                                        value={generatedLink.share_url}
                                        readOnly
                                        className="font-mono text-sm"
                                    />
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={copyToClipboard}>
                                            <Copy className="mr-2 h-4 w-4" />
                                            {t("deeplink.actions.copy")}
                                        </Button>
                                        <Button variant="outline" asChild>
                                            <a
                                                href={generatedLink.share_url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <ExternalLink className="mr-2 h-4 w-4" />
                                                {t("deeplink.actions.open")}
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>{t("deeplink.result.metaTitle")}</Label>
                                    <div className="rounded-xl border bg-muted/30 px-4 py-3 text-sm font-medium">
                                        {generatedLink.meta_title}
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label>{t("deeplink.result.metaDescription")}</Label>
                                    <Textarea
                                        readOnly
                                        value={generatedLink.meta_desc || t("deeplink.result.noDescription")}
                                        className="min-h-28 resize-none bg-muted/20"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-6 py-10 text-center">
                            <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                                <Sparkles className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-semibold">
                                {t("deeplink.result.emptyTitle")}
                            </h3>
                            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                                {t("deeplink.result.emptyDescription")}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default DeeplinkTab;
